import { WebSocketServer } from 'ws';

import { ERRORS } from '../const';
import { DataBase } from './dataBase';
import { ClientMessageType, ServerMessageType } from './types';
import { decodeClientMessage, send } from './utils';
import { User } from './user';
import { Game } from './game';

const db = new DataBase();

export const startWsServer = (port: number) => {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws) => {
    console.log('New client connected!');
    let currentUser: User;
    let currentGame: Game;
    ws.on('close', () => console.log('Client has disconnected!'));
    ws.on('message', (rawMessage) => {
      console.log(`Message: ${String(rawMessage)}`);
      const { type, data } = decodeClientMessage(String(rawMessage));
      switch (type) {
        case ClientMessageType.REG: {
          currentUser = db.createNewUser(data.name, data.password);
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
          if (room && db.isPlayersReady(room)) {
            currentGame = db.createNewGame(currentUser, room);
            send(wss.clients, {
              type: ServerMessageType.CREATE_GAME,
              payload: { game: currentGame, player: currentUser },
            });
          }
          send(wss.clients, { type: ServerMessageType.UPDATE_ROOM, payload: db.getRooms() });
          break;
        }
        case ClientMessageType.ADD_SHIPS: {
          currentGame.addShips(currentUser, data.ships);
          break;
        }
        case ClientMessageType.ATTACK:
          break;
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
