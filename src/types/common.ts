import { Ship, User } from '.';

export const enum RoomStatus {
  OPEN = 'open',
  CLOSE = 'close',
}

export interface Player {
  user: User;
  shipsPosition: ShipPosition[];
  ships: Ship[];
  field: Field;
}

export type Field = (Ship | null)[][];

export const enum ShipType {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  HUGE = 'huge',
}

export const enum ShipDirection {
  HORIZONTALLY = 'horizontally',
  VERTICALLY = 'vertically',
}

export interface ShipPosition {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: ShipType;
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
