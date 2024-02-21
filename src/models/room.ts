import { uuid } from '../utils';
import { Game, RoomStatus, User } from '../types';
import { NUMBER_OF_PLAYERS_FOR_A_GAME } from '../const';

export class Room {
  public readonly index: number;
  public players: User[] = [];
  public status: RoomStatus;
  public game: Game | null = null;

  constructor(user: User) {
    this.index = uuid();
    this.players.push(user);
    this.status = RoomStatus.OPEN;
  }

  public addPlayer(user: User): void {
    this.players.push(user);
  }

  public createNewGame(): Game {
    this.game = new Game(this.players);
    this.status = RoomStatus.CLOSE;
    return this.game;
  }

  public isFull(): boolean {
    return this.players.length === NUMBER_OF_PLAYERS_FOR_A_GAME;
  }
}
