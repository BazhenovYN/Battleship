import { User } from './user';

// type AttackStatus = 'miss' | 'killed' | 'shot';

type ShipType = 'small' | 'medium' | 'large' | 'huge';

interface Ship {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: ShipType;
}

interface PlayerData {
  user: User;
  ships: Ship[];
  // shots: Shot[];
}

export class Game {
  public readonly index: number;
  private player1: PlayerData;
  private player2: PlayerData;
  private turn: User;

  constructor(players: User[], index: number) {
    this.index = index;
    const [user1, user2] = players;
    this.player1 = {
      user: user1,
      ships: [],
    };
    this.player2 = {
      user: user2,
      ships: [],
    };
    this.turn = this.getRandomUser(user1, user2);
  }

  private getRandomUser(user1: User, user2: User) {
    return Math.random() < 0.5 ? user1 : user2;
  }

  private isGameReady() {
    return this.player1.ships.length > 0 && this.player2.ships.length;
  }

  public changePlayersTurn() {
    this.turn = this.turn === this.player1.user ? this.player2.user : this.player1.user;
  }

  public addShips(user: User, ships: Ship[]) {}
}
