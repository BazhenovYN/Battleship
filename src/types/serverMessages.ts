import { AttackStatus, ShipPosition } from '../types';

export const enum ServerMessageType {
  REG = 'reg',
  UPDATE_ROOM = 'update_room',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  CREATE_GAME = 'create_game',
  START_GAME = 'start_game',
  ATTACK = 'attack',
  TURN = 'turn',
  FINISH = 'finish',
  UPDATE_WINNERS = 'update_winners',
}

type ServerMessageBase<T> = {
  type: T;
};

type ServerMessageReg = ServerMessageBase<ServerMessageType.REG> & {
  payload: {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
  };
};

type ServerMessageUpdateWinners = ServerMessageBase<ServerMessageType.UPDATE_WINNERS> & {
  payload: {
    name: string;
    wins: number;
  }[];
};

type ServerMessageCreateGame = ServerMessageBase<ServerMessageType.CREATE_GAME> & {
  payload: {
    idGame: number;
    idPlayer: number;
  };
};

type ServerMessageUpdateRoom = ServerMessageBase<ServerMessageType.UPDATE_ROOM> & {
  payload: {
    roomId: number;
    roomUsers: {
      name: string;
      index: number;
    }[];
  }[];
};

type ServerMessageStartGame = ServerMessageBase<ServerMessageType.START_GAME> & {
  payload: {
    ships: ShipPosition[];
    currentPlayerIndex: number;
  };
};

type ServerMessageTurn = ServerMessageBase<ServerMessageType.TURN> & {
  payload: {
    currentPlayer: number;
  };
};

type ServerMessageAttack = ServerMessageBase<ServerMessageType.ATTACK> & {
  payload: {
    position: {
      x: number;
      y: number;
    };
    currentPlayer: number;
    status: AttackStatus;
  };
};

type ServerMessageFinish = ServerMessageBase<ServerMessageType.FINISH> & {
  payload: {
    winPlayer: number;
  };
};

export type ServerMessage =
  | ServerMessageReg
  | ServerMessageUpdateWinners
  | ServerMessageCreateGame
  | ServerMessageUpdateRoom
  | ServerMessageStartGame
  | ServerMessageTurn
  | ServerMessageAttack
  | ServerMessageFinish;
