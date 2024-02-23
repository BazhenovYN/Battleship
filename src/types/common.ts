import { Ship, User } from '.';

export const enum RoomStatus {
  OPEN = 'open',
  CLOSE = 'close',
}

export const enum UserType {
  HUMAN = 'human',
  BOT = 'bot',
}

export interface Player {
  user: User;
  shipsPosition: ShipPosition[];
  ships: Ship[];
  field: Field;
}

export type Coordinates = {
  x: number;
  y: number;
};

export type Field = (Ship | null)[][];

export const enum ShipDirection {
  HORIZONTALLY = 'horizontally',
  VERTICALLY = 'vertically',
}

export interface ShipPosition {
  position: Coordinates;
  direction: boolean;
  length: number;
}

export const enum AttackStatus {
  MISS = 'miss',
  KILLED = 'killed',
  SHOT = 'shot',
}

export interface AttackResult {
  x: number;
  y: number;
  status: AttackStatus;
}
