export const enum ClientMessageType {
  REG = 'reg',
  CREATE_ROOM = 'create_room',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  ADD_SHIP = 'add_ships',
  ATTACK = 'attack',
  RANDOM_ATTACK = 'randomAttack',
}

export type ServerMessageType =
  | 'reg'
  | 'update_room'
  // | 'add_user_to_room'
  | 'create_game'
  | 'start_game'
  // | 'attack'
  // | 'turn'
  // | 'finish'
  | 'update_winners';

export type ClientMessageDataMap = {
  [ClientMessageType.REG]: {
    name: string;
    password: string;
  };
  [ClientMessageType.CREATE_ROOM]: '';
  [ClientMessageType.ADD_USER_TO_ROOM]: {
    indexRoom: number;
  };
  [ClientMessageType.ADD_SHIP]: {
    gameId: number;
    ships: Ship[];
    indexPlayer: number;
  };
  [ClientMessageType.ATTACK]: {
    gameId: number;
    x: number;
    y: number;
    indexPlayer: number;
  };
  [ClientMessageType.RANDOM_ATTACK]: {
    gameId: number;
    indexPlayer: number;
  };
};

export type ServerMessageDataMap = {
  reg: {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
  };
  update_winners: {
    name: string;
    wins: number;
  }[];
  create_game: {
    idGame: number;
    idPlayer: number;
  };
  update_room: {
    roomId: number;
    roomUsers: {
      name: string;
      index: number;
    }[];
  }[];
  start_game: {
    ships: Ship[];
    currentPlayerIndex: number;
  };
};

export interface ClientMessage<T extends ClientMessageType = ClientMessageType> {
  type: T;
  data: ClientMessageDataMap[T];
  id: 0;
}

export interface ServerMessage<T extends keyof ServerMessageDataMap> {
  type: T;
  data: ServerMessageDataMap[T];
  id: 0;
}

export interface User {
  id: number;
  name: string;
  password: string;
  wins: number;
}

export type AttackStatus = 'miss' | 'killed' | 'shot';

type ShipType = 'small' | 'medium' | 'large' | 'huge';

export interface Ship {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: ShipType;
}

export interface Room {
  id: number;
  players: User[];
  game: Game | null;
}

export interface Game {
  id: number;
  shipsP1: Ship[];
  shipsP2: Ship[];
  currentPlayer: User;
}
