import { Server, WebSocket } from 'ws';

import { ERRORS, FIELD_SIZE } from '../../const';
import { gameService, roomService, userService } from '../../services';
import { ServerMessageType, ShipPosition, User } from '../../types';
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
    user.connection.close();
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
        payload: { game: game, player: player.user },
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
  const turn = game.getTurn();

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
        payload: turn,
      });
    });
  });

  if (game.gameOver) {
    players.forEach((player) => {
      send(player.user.connection, {
        type: ServerMessageType.FINISH,
        payload: user,
      });
    });
    send(wss.clients, {
      type: ServerMessageType.UPDATE_WINNERS,
      payload: userService.getWinners(),
    });
  }
};

export const randomAttack = (wss: Server, user: User | null, gameId: number) => {
  if (!user) {
    throw new Error(ERRORS.USER_NOT_FOUND);
  }
  const { x, y } = getRandomCoordinates(FIELD_SIZE);
  attack(wss, user, gameId, x, y);
};

export const deleteUserRooms = (wss: Server, user: User) => {
  roomService.deleteUserRooms(user);
  send(wss.clients, { type: ServerMessageType.UPDATE_ROOM, payload: roomService.getOpenedRooms() });
};
