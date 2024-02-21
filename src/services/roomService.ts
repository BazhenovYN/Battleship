import { ERRORS } from '../const';
import { db } from '../database';
import { Room, RoomStatus, User } from '../types';

export const getOpenedRooms = (): Room[] => {
  return db.getAllRooms().filter((room) => room.status === RoomStatus.OPEN);
};

export const createNewRoom = (user: User): void => {
  const newRoom = new Room(user);
  db.addRoom(newRoom);
};

export const addUserToRoom = (user: User, roomId: number): Room => {
  const room = db.getRoomById(roomId);
  if (!room) {
    throw Error(ERRORS.GAME_DATA_NOT_FOUND);
  }
  room.addPlayer(user);
  return room;
};

export const deleteUserRooms = (user: User): void => db.deleteUserRooms(user);
