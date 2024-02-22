import { WebSocket } from 'ws';
import { db } from '../database';
import { User } from '../types';
import { ERRORS } from '../const';

export const getUserById = (id: number): User | null => {
  return db.getUserById(id) ?? null;
};

export const signIn = (name: string, password: string, ws: WebSocket, userId: number) => {
  const user = db.getUserByName(name);

  if (!user) {
    const newUser = createNewUser(name, password, ws, userId);
    return { user: newUser, isNewUser: true, error: false, errorText: '' };
  }

  if (user.isPasswordValid(password)) {
    return { user, isNewUser: false, error: false, errorText: '' };
  }

  return { user: null, isNewUser: false, error: true, errorText: ERRORS.INVALID_PASSWORD };
};

const createNewUser = (name: string, password: string, ws: WebSocket, userId: number): User => {
  const newUser = new User(name, password, ws, userId);
  db.addUser(newUser);
  return newUser;
};

export const getWinners = (): User[] => {
  return db.getAllUsers();
};
