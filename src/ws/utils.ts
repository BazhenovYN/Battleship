import { WebSocket } from 'ws';

import { ClientMessage, dbData, ServerMessage, ServerMessageType } from './types';

export const decodeClientMessage = (rawMessage: string): ClientMessage => {
  const { type, data: rawData } = JSON.parse(rawMessage);
  const data = rawData === '' ? '' : JSON.parse(rawData);
  return { type, data } as ClientMessage;
};

const adapt = (data: dbData): ServerMessage['data'] | null => {
  const { type, payload } = data;
  switch (type) {
    case ServerMessageType.REG:
      return {
        name: payload.name,
        index: payload.index,
        error: false,
        errorText: '',
      };
    case ServerMessageType.UPDATE_ROOM:
      return payload.map((room) => ({
        roomId: room.index,
        roomUsers: room.players.map((player) => ({ name: player.name, index: player.index })),
      }));
    case ServerMessageType.CREATE_GAME:
      return { idGame: payload.game.index, idPlayer: payload.player.index };
    case ServerMessageType.UPDATE_WINNERS:
      return payload.map((user) => ({ name: user.name, wins: user.wins }));
    case ServerMessageType.START_GAME: {
      const player = payload.game.getPlayer(payload.user);
      return { ships: player.shipsPosition, currentPlayerIndex: payload.user.index };
    }
    case ServerMessageType.TURN:
      return {
        currentPlayer: payload.index,
      };
    case ServerMessageType.ATTACK:
      return {
        position: payload.position,
        currentPlayer: payload.user.index,
        status: payload.status,
      };
    default:
      return null;
  }
};

const generateServerMessage = (type: ServerMessageType, data: ServerMessage['data']) =>
  JSON.stringify({
    type,
    data: JSON.stringify(data),
    id: 0,
  });

export const send = (ws: WebSocket | Set<WebSocket>, data: dbData) => {
  const { type } = data;
  const clients = ws instanceof WebSocket ? [ws] : [...ws];
  clients.map((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const adaptedData = adapt(data);
      if (adaptedData) {
        const message = generateServerMessage(type, adaptedData);
        console.log('Server message:', message);
        client.send(message);
      }
    }
  });
};
