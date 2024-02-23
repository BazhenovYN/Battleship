import { AttackStatus, Game, Room, User } from '../types';
import { ServerMessageType } from './serverMessages';

type InnerDataBase<T> = {
  type: T;
};

type InnerDataReg = InnerDataBase<ServerMessageType.REG> & {
  payload: {
    user: User | null;
    error: boolean;
    errorText: string;
  };
};

type InnerDataUpdateWinners = InnerDataBase<ServerMessageType.UPDATE_WINNERS> & {
  payload: User[];
};

type InnerDataCreateGame = InnerDataBase<ServerMessageType.CREATE_GAME> & {
  payload: {
    game: Game;
    user: User;
  };
};

type InnerDataUpdateRoom = InnerDataBase<ServerMessageType.UPDATE_ROOM> & {
  payload: Room[];
};

type InnerDataStartGame = InnerDataBase<ServerMessageType.START_GAME> & {
  payload: {
    game: Game;
    user: User;
  };
};

type InnerDataTurn = InnerDataBase<ServerMessageType.TURN> & {
  payload: User;
};

type InnerDataAttack = InnerDataBase<ServerMessageType.ATTACK> & {
  payload: {
    position: {
      x: number;
      y: number;
    };
    user: User;
    status: AttackStatus;
  };
};

type InnerDataFinish = InnerDataBase<ServerMessageType.FINISH> & {
  payload: User;
};

export type InnerData =
  | InnerDataReg
  | InnerDataUpdateWinners
  | InnerDataCreateGame
  | InnerDataUpdateRoom
  | InnerDataStartGame
  | InnerDataTurn
  | InnerDataAttack
  | InnerDataFinish;
