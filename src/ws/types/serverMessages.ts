import { ServerMessageType, Ship } from './common';

type ServerMessageBase<T> = {
  type: T;
};

type ServerMessageReg = ServerMessageBase<ServerMessageType.REG> & {
  data: {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
  };
};

type ServerMessageUpdateWinners = ServerMessageBase<ServerMessageType.UPDATE_WINNERS> & {
  data: {
    name: string;
    wins: number;
  }[];
};

type ServerMessageCreateGame = ServerMessageBase<ServerMessageType.CREATE_GAME> & {
  data: {
    idGame: number;
    idPlayer: number;
  };
};

type ServerMessageUpdateRoom = ServerMessageBase<ServerMessageType.UPDATE_ROOM> & {
  data: {
    roomId: number;
    roomUsers: {
      name: string;
      index: number;
    }[];
  }[];
};

type ServerMessageStartGame = ServerMessageBase<ServerMessageType.START_GAME> & {
  data: {
    ships: Ship[];
    currentPlayerIndex: number;
  };
};

type ServerMessageTurn = ServerMessageBase<ServerMessageType.TURN> & {
  data: {
    currentPlayer: number;
  };
};

export type ServerMessage =
  | ServerMessageReg
  | ServerMessageUpdateWinners
  | ServerMessageCreateGame
  | ServerMessageUpdateRoom
  | ServerMessageStartGame
  | ServerMessageTurn;
