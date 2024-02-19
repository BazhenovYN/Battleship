import { Game } from '../game';
import { Room } from '../room';
import { User } from '../user';
import { AttackStatus, ServerMessageType } from './common';

type dbBase<T> = {
  type: T;
};

type dbReg = dbBase<ServerMessageType.REG> & {
  payload: User;
};

type dbUpdateWinners = dbBase<ServerMessageType.UPDATE_WINNERS> & {
  payload: User[];
};

type dbCreateGame = dbBase<ServerMessageType.CREATE_GAME> & {
  payload: {
    game: Game;
    player: User;
  };
};

type dbUpdateRoom = dbBase<ServerMessageType.UPDATE_ROOM> & {
  payload: Room[];
};

type dbStartGame = dbBase<ServerMessageType.START_GAME> & {
  payload: {
    game: Game;
    user: User;
  };
};

type dbTurn = dbBase<ServerMessageType.TURN> & {
  payload: User;
};

type dbAttack = dbBase<ServerMessageType.ATTACK> & {
  payload: {
    position: {
      x: number;
      y: number;
    };
    user: User;
    status: AttackStatus;
  };
};

export type dbData =
  | dbReg
  | dbUpdateWinners
  | dbCreateGame
  | dbUpdateRoom
  | dbStartGame
  | dbTurn
  | dbAttack;
