import { Room } from '../types';
import { User } from './user';

export class DataBase {
  private Users: User[] = [];
  private Rooms: Room[] = [];

  createNewUser(name: string, password: string) {
    const newUser = new User(name, password, this.Users.length);
    this.Users.push(newUser);
    return {
      name: newUser.name,
      id: newUser.index,
    };
  }
}
