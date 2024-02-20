import { Game } from './game';
import { RoomStatus } from './types';
import { User } from './user';

export class Room {
  public readonly index: number;
  public players: User[] = [];
  public status: RoomStatus;
  public game: Game | null = null;

  constructor(user: User, index: number) {
    this.index = index;
    this.players.push(user);
    this.status = RoomStatus.OPEN;
  }

  public addPlayer(user: User): void {
    this.players.push(user);
  }

  public createNewGame(id: number): Game {
    this.game = new Game(this.players, id);
    this.status = RoomStatus.CLOSE;
    return this.game;
  }
}
