export const enum ClientMessageType {
  REG = 'reg',
  CREATE_ROOM = 'create_room',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  ADD_SHIPS = 'add_ships',
  ATTACK = 'attack',
  RANDOM_ATTACK = 'randomAttack',
  SINGLE_PLAY = 'single_play',
}

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
