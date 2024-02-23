import { WebSocket } from 'ws';
import { ServerMessage, ServerMessageType, InnerData } from '../../types';

export const send = (ws: WebSocket | Set<WebSocket> | undefined | null, innerData: InnerData) => {
  if (!ws) {
    return;
  }
  const { type } = innerData;
  const clients = ws instanceof WebSocket ? [ws] : [...ws];

  clients.map((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const data = adapt(innerData);
      if (data) {
        const message = generateServerMessage(type, data);
        client.send(message);
      }
    }
  });
};

const generateServerMessage = (type: ServerMessageType, data: ServerMessage['payload']) =>
  JSON.stringify({
    type,
    data: JSON.stringify(data),
    id: 0,
  });

const adapt = (data: InnerData): ServerMessage['payload'] | null => {
  const { type, payload } = data;

  switch (type) {
    case ServerMessageType.REG:
      return {
        name: payload.user?.name ?? '',
        index: payload.user?.index ?? 0,
        error: payload.error,
        errorText: payload.errorText,
      };
    case ServerMessageType.UPDATE_ROOM:
      return payload.map((room) => ({
        roomId: room.index,
        roomUsers: room.users.map((player) => ({ name: player.name, index: player.index })),
      }));
    case ServerMessageType.CREATE_GAME:
      return { idGame: payload.game.index, idPlayer: payload.user.index };
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
    case ServerMessageType.FINISH:
      return {
        winPlayer: payload?.index ?? 0,
      };
    default:
      return null;
  }
};
