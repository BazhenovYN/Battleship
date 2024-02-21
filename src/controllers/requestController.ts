import { RawData, Server, WebSocket } from 'ws';

import { ERRORS } from '../const';
import { userService } from '../services';
import { ClientMessage, ClientMessageType } from '../types';
import {
  addShips,
  addUserToRoom,
  attack,
  createNewRoom,
  randomAttack,
  registerUser,
} from './helpers';

const decodeClientMessage = (rawMessage: string): ClientMessage => {
  const { type, data: rawData } = JSON.parse(rawMessage);
  const data = rawData === '' ? '' : JSON.parse(rawData);
  return { type, data } as ClientMessage;
};

export const handleRequest = (wss: Server, ws: WebSocket, userId: number, rawMessage: RawData) => {
  console.log(`Client message: ${String(rawMessage)}`);

  const currentUser = userService.getUserById(userId);
  const { type, data } = decodeClientMessage(String(rawMessage));

  switch (type) {
    case ClientMessageType.REG:
      registerUser(wss, ws, data.name, data.password, userId);
      break;
    case ClientMessageType.CREATE_ROOM:
      createNewRoom(wss, currentUser);
      break;
    case ClientMessageType.ADD_USER_TO_ROOM:
      addUserToRoom(wss, currentUser, data.indexRoom);
      break;
    case ClientMessageType.ADD_SHIPS:
      addShips(currentUser, data.gameId, data.ships);
      break;
    case ClientMessageType.ATTACK:
      attack(wss, currentUser, data.gameId, data.x, data.y);
      break;
    case ClientMessageType.RANDOM_ATTACK:
      randomAttack(wss, currentUser, data.gameId);
      break;
    case ClientMessageType.SINGLE_PLAY:
      break;

    default:
      ws.send(ERRORS.UNKNOWN_MESSAGE_TYPE);
      break;
  }
};
