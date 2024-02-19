import { WebSocketServer } from 'ws';

import { ERRORS } from '../const';
import { DataBase } from './dataBase';
import { ClientMessageType, ServerMessageType } from './types';
import { User } from './user';
import { decodeClientMessage, send } from './utils';

const db = new DataBase();

export const startWsServer = (port: number) => {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws) => {
    console.log('New client connected!');
    let currentUser: User;
    ws.on('close', () => console.log('Client has disconnected!'));
    ws.on('message', (rawMessage) => {
      console.log(`Client message: ${String(rawMessage)}`);
      const { type, data } = decodeClientMessage(String(rawMessage));
      switch (type) {
        case ClientMessageType.REG: {
          currentUser = db.createNewUser(data.name, data.password, ws);
          send(ws, { type: ServerMessageType.REG, payload: currentUser });
          send(wss.clients, { type: ServerMessageType.UPDATE_ROOM, payload: db.getRooms() });
          send(wss.clients, { type: ServerMessageType.UPDATE_WINNERS, payload: db.getWinners() });
          break;
        }
        case ClientMessageType.CREATE_ROOM: {
          db.createNewRoom(currentUser);
          send(wss.clients, { type: ServerMessageType.UPDATE_ROOM, payload: db.getRooms() });
          break;
        }
        case ClientMessageType.ADD_USER_TO_ROOM: {
          const room = db.addUserToRoom(currentUser, data.indexRoom);
          if (db.isPlayersReady(room)) {
            const game = db.createNewGame(room);
            const players = game.getPlayers();
            players.forEach((player) => {
              send(player.user.connection, {
                type: ServerMessageType.CREATE_GAME,
                payload: { game: game, player: player.user },
              });
            });
          }
          send(wss.clients, { type: ServerMessageType.UPDATE_ROOM, payload: db.getRooms() });
          break;
        }
        case ClientMessageType.ADD_SHIPS: {
          const game = db.getGameById(data.gameId);
          game.addShips(currentUser, data.ships);

          if (game.isPlayersReady()) {
            const players = game.getPlayers();
            players.forEach((player) => {
              send(player.user.connection, {
                type: ServerMessageType.START_GAME,
                payload: { game: game, user: player.user },
              });
              send(player.user.connection, {
                type: ServerMessageType.TURN,
                payload: game.getTurn(),
              });
            });
          }
          break;
        }
        case ClientMessageType.ATTACK: {
          const game = db.getGameById(data.gameId);

          if (!game.isUserAttack(currentUser)) {
            return;
          }
          const { x, y } = data;
          const status = game.attack(currentUser, x, y);
          const players = game.getPlayers();
          players.forEach((player) => {
            send(player.user.connection, {
              type: ServerMessageType.ATTACK,
              payload: {
                position: { x, y },
                user: currentUser,
                status,
              },
            });
            send(player.user.connection, {
              type: ServerMessageType.TURN,
              payload: game.getTurn(),
            });
          });
          break;
        }
        case ClientMessageType.RANDOM_ATTACK:
          break;
        case ClientMessageType.SINGLE_PLAY:
          break;
        default:
          ws.send(ERRORS.UNKNOWN_MESSAGE_TYPE);
          break;
      }
    });
    ws.onerror = function () {
      console.log('websocket error');
    };
  });

  return wss;
};
