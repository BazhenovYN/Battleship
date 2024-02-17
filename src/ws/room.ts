import { User } from './user';

export class Room {
  public readonly index: number;
  public players: User[] = [];

  constructor(user: User, index: number) {
    this.index = index;
    this.players.push(user);
  }

  public addPlayer(user: User) {
    this.players.push(user);
  }
}
