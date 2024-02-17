import { Game } from '../game';
import { Room } from '../room';
import { User } from '../user';
import { ServerMessageType } from './common';

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
  payload: Game;
};

export type dbData = dbReg | dbUpdateWinners | dbCreateGame | dbUpdateRoom | dbStartGame;
