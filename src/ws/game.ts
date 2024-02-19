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

interface Player {
  user: User;
  ships: Ship[];
  // shots: Shot[];
}

export class Game {
  public readonly index: number;
  private players: Player[] = [];
  public turn: User;

  constructor(players: User[], index: number) {
    const [user1, user2] = players;
    this.players.push({ user: user1, ships: [] });
    this.players.push({ user: user2, ships: [] });

    this.index = index;

    this.turn = this.getRandomUser(user1, user2);
  }

  private getRandomUser(user1: User, user2: User): User {
    return Math.random() < 0.5 ? user1 : user2;
  }

  public isPlayersReady(): boolean {
    return this.players.every((player) => player.ships.length > 0);
  }

  public changePlayersTurn(): User {
    const index = this.players.findIndex((player) => player.user === this.turn);
    const newIndex = index < this.players.length - 1 ? index + 1 : 0;
    this.turn = this.players[newIndex].user;
    return this.turn;
  }

  public getPlayer(user: User) {
    return this.players.find((curr) => curr.user === user);
  }

  public addShips(user: User, ships: Ship[]): void {
    const player = this.getPlayer(user);
    if (player) {
      player.ships = ships;
    }
  }

  public getPlayers() {
    return this.players;
  }
}
