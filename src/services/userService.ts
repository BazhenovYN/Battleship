import { WebSocket } from 'ws';
import { db } from '../database';
import { User } from '../types';

export const getUserById = (id: number): User | null => {
  return db.getUserById(id) ?? null;
};

export const createNewUser = (
  name: string,
  password: string,
  ws: WebSocket,
  userId: number
): User => {
  const newUser = new User(name, password, ws, userId);
  db.addUser(newUser);
  return newUser;
};

export const getWinners = () => {
  return db.getAllUsers();
};
