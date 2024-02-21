import { Room, User } from '../types';

class DB {
  private users: User[] = [];
  private rooms: Room[] = [];

  public addUser(user: User): void {
    this.users.push(user);
  }

  public getUserById(id: number): User | undefined {
    return this.users.find((user) => user.index === id);
  }

  public getAllUsers(): User[] {
    return this.users;
  }

  public addRoom(room: Room): void {
    this.rooms.push(room);
  }

  public deleteUserRooms(user: User): void {
    this.rooms = this.rooms.filter((room) => room.users.indexOf(user) < 0);
  }

  public getRoomById(id: number): Room | undefined {
    return this.rooms.find((room) => room.index === id);
  }

  public getAllRooms(): Room[] {
    return this.rooms;
  }
}

export const db = new DB();
