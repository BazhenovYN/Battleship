import { uuid } from '../utils';
import { Game, RoomStatus, User } from '../types';
import { NUMBER_OF_PLAYERS_FOR_A_GAME } from '../const';

export class Room {
  public readonly index: number;
  public users: User[] = [];
  public status: RoomStatus;
  public game: Game | null = null;

  constructor(user: User, isOpen: boolean) {
    this.index = uuid();
    this.users.push(user);
    this.status = isOpen ? RoomStatus.OPEN : RoomStatus.CLOSE;
  }

  public addPlayer(user: User): void {
    if (this.users.indexOf(user) < 0) {
      this.users.push(user);
    }
  }

  public createNewGame(isSingleGame = false): Game {
    this.game = new Game(this.users, isSingleGame);
    this.status = RoomStatus.CLOSE;
    return this.game;
  }

  public isFull(): boolean {
    return this.users.length === NUMBER_OF_PLAYERS_FOR_A_GAME;
  }
}
