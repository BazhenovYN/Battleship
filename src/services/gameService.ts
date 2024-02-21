import { ERRORS } from '../const';
import { db } from '../database';
import { Game, Room, RoomStatus } from '../types';

export const createNewGame = (room: Room): Game => {
  return room.createNewGame();
};

export const getGameById = (gameId: number): Game => {
  const room = db
    .getAllRooms()
    .filter((room) => room.status === RoomStatus.CLOSE)
    .find((room) => room.game?.index === gameId);
  if (!room?.game) {
    throw Error(ERRORS.GAME_DATA_NOT_FOUND);
  }
  return room.game;
};
