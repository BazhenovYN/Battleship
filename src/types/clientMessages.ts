import { ShipPosition } from '../types';

export const enum ClientMessageType {
  REG = 'reg',
  CREATE_ROOM = 'create_room',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  ADD_SHIPS = 'add_ships',
  ATTACK = 'attack',
  RANDOM_ATTACK = 'randomAttack',
  SINGLE_PLAY = 'single_play',
}

type ClientMessageBase<T> = {
  type: T;
};

type ClientMessageReg = ClientMessageBase<ClientMessageType.REG> & {
  data: {
    name: string;
    password: string;
  };
};

type ClientMessageCreateRoom = ClientMessageBase<ClientMessageType.CREATE_ROOM> & {
  data: '';
};

type ClientMessageAddUserToRoom = ClientMessageBase<ClientMessageType.ADD_USER_TO_ROOM> & {
  data: {
    indexRoom: number;
  };
};

type ClientMessageAddShip = ClientMessageBase<ClientMessageType.ADD_SHIPS> & {
  data: {
    gameId: number;
    ships: ShipPosition[];
    indexPlayer: number;
  };
};

type ClientMessageAttack = ClientMessageBase<ClientMessageType.ATTACK> & {
  data: {
    gameId: number;
    x: number;
    y: number;
    indexPlayer: number;
  };
};

type ClientMessageRandomAttack = ClientMessageBase<ClientMessageType.RANDOM_ATTACK> & {
  data: {
    gameId: number;
    indexPlayer: number;
  };
};

type ClientMessageSinglePlay = ClientMessageBase<ClientMessageType.SINGLE_PLAY> & {
  data: '';
};

export type ClientMessage =
  | ClientMessageReg
  | ClientMessageCreateRoom
  | ClientMessageAddUserToRoom
  | ClientMessageAddShip
  | ClientMessageAttack
  | ClientMessageRandomAttack
  | ClientMessageSinglePlay;
