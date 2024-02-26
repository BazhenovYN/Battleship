import { Server, WebSocket } from 'ws';

import { BOT_DELAY, ERRORS, FIELD_SIZE } from '../../const';
import { gameService, roomService, userService } from '../../services';
import { Game, ServerMessageType, ShipPosition, User, UserType } from '../../types';
import { getRandomCoordinates } from '../../utils';
import { send } from './sendMessage';

export const registerUser = (
  wss: Server,
  ws: WebSocket,
  name: string,
  password: string,
  userId: number
) => {
  const { user, isNewUser, error, errorText } = userService.signIn(name, password, ws, userId);

  if (user && !isNewUser) {
    user.connection?.close();
    user.updateConnection(ws, userId);
  }

  send(ws, { type: ServerMessageType.REG, payload: { user, error, errorText } });

  if (!error) {
    send(wss.clients, {
      type: ServerMessageType.UPDATE_ROOM,
      payload: roomService.getOpenedRooms(),
    });
    send(wss.clients, {
      type: ServerMessageType.UPDATE_WINNERS,
      payload: userService.getWinners(),
    });
  }
};

export const createNewRoom = (wss: Server, user: User | null) => {
  if (!user) {
    throw new Error(ERRORS.USER_NOT_FOUND);
  }
  roomService.createNewRoom(user);
  send(wss.clients, { type: ServerMessageType.UPDATE_ROOM, payload: roomService.getOpenedRooms() });
};

export const addUserToRoom = (wss: Server, user: User | null, roomId: number) => {
  if (!user) {
    throw new Error(ERRORS.USER_NOT_FOUND);
  }
  const room = roomService.addUserToRoom(user, roomId);
  if (room.isFull()) {
    const game = gameService.createNewGame(room);
    const players = game.getPlayers();
    players.forEach((player) => {
      send(player.user.connection, {
        type: ServerMessageType.CREATE_GAME,
        payload: { game: game, user: player.user },
      });
    });
  }
  send(wss.clients, { type: ServerMessageType.UPDATE_ROOM, payload: roomService.getOpenedRooms() });
};

export const addShips = (user: User | null, gameId: number, ships: ShipPosition[]) => {
  if (!user) {
    throw new Error(ERRORS.USER_NOT_FOUND);
  }
  const game = gameService.getGameById(gameId);

  game.addShips(user, ships);

  if (game.isPlayersReadyToStart()) {
    const players = game.getPlayers();
    players.forEach((player) => {
      send(player.user.connection, {
        type: ServerMessageType.START_GAME,
        payload: { game, user: player.user },
      });
      send(player.user.connection, {
        type: ServerMessageType.TURN,
        payload: game.getTurn(),
      });
    });
  }
};

export const attack = (wss: Server, user: User | null, gameId: number, x: number, y: number) => {
  if (!user) {
    throw new Error(ERRORS.USER_NOT_FOUND);
  }
  const game = gameService.getGameById(gameId);

  if (!game.isUserAttack(user)) {
    return;
  }

  const results = game.attack(user, x, y);
  const players = game.getPlayers();
  const nextUser = game.getTurn();

  players.forEach((player) => {
    results.forEach((cell) => {
      send(player.user.connection, {
        type: ServerMessageType.ATTACK,
        payload: {
          position: { x: cell.x, y: cell.y },
          user,
          status: cell.status,
        },
      });
      send(player.user.connection, {
        type: ServerMessageType.TURN,
        payload: nextUser,
      });
    });
  });

  checkGameOver(wss, game);

  if (game.isSingleGame && !game.gameOver && nextUser.type === UserType.BOT) {
    botAttack(wss, game);
  }
};

export const randomAttack = (wss: Server, user: User | null, gameId: number) => {
  if (!user) {
    throw new Error(ERRORS.USER_NOT_FOUND);
  }
  const game = gameService.getGameById(gameId);
  const player = game.getPlayer(user);
  const { x, y } = getRandomCoordinates(FIELD_SIZE, player.shots);

  attack(wss, user, gameId, x, y);
};

export const deleteUserRooms = (wss: Server, user: User) => {
  roomService.deleteUserRooms(user);
  send(wss.clients, { type: ServerMessageType.UPDATE_ROOM, payload: roomService.getOpenedRooms() });
};

export const startSinglePlay = (user: User | null) => {
  if (!user) {
    throw new Error(ERRORS.USER_NOT_FOUND);
  }

  const room = roomService.createNewPrivateRoom(user);
  const game = gameService.createNewSingleGame(room);

  send(user.connection, {
    type: ServerMessageType.CREATE_GAME,
    payload: { game, user },
  });
};

export const disconnectUser = (wss: Server, user: User) => {
  user.closeConnection();

  const games = gameService.finishAllUserGames(user);
  games.forEach((game) => checkGameOver(wss, game));

  deleteUserRooms(wss, user);
};

const checkGameOver = (wss: Server, game: Game) => {
  if (!game.gameOver) {
    return;
  }

  const players = game.getPlayers();

  players.forEach((player) => {
    send(player.user.connection, {
      type: ServerMessageType.FINISH,
      payload: game.winner,
    });
  });
  send(wss.clients, {
    type: ServerMessageType.UPDATE_WINNERS,
    payload: userService.getWinners(),
  });
};

const botAttack = (wss: Server, game: Game) => {
  const bot = game.getBot();

  setTimeout(() => {
    randomAttack(wss, bot, game.index);
  }, BOT_DELAY);
};
