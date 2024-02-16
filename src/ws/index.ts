import { WebSocketServer } from 'ws';

import { decodeRawMessage } from './utils';
import { ERRORS } from '../const';
import { ClientMessageDataMap, ClientMessageType } from '../types';
import { DataBase } from './dataBase';

const db = new DataBase();

export const startWsServer = (port: number) => {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws) => {
    console.log('New client connected!');
    ws.send(JSON.stringify({ data: 'test' }));
    ws.on('close', () => console.log('Client has disconnected!'));
    ws.on('message', (rawMessage) => {
      console.log(`Message: ${String(rawMessage)}`);
      const { type, data } = decodeRawMessage(String(rawMessage));
      switch (type) {
        case ClientMessageType.REG: {
          const { name, password } = data as ClientMessageDataMap[ClientMessageType.REG];
          const result = db.createNewUser(name, password);
          ws.send(JSON.stringify(result));
          break;
        }
        case ClientMessageType.CREATE_ROOM:
          break;
        case ClientMessageType.ADD_USER_TO_ROOM:
          break;
        case ClientMessageType.ADD_SHIP:
          break;
        case ClientMessageType.ATTACK:
          break;
        case ClientMessageType.RANDOM_ATTACK:
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
