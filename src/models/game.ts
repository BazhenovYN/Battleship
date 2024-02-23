import { ERRORS, FIELD_SIZE, SHIP_WIDTH } from '../const';
import {
  AttackResult,
  AttackStatus,
  Field,
  Player,
  Ship,
  ShipDirection,
  ShipPosition,
  User,
  UserType,
} from '../types';
import { getRandomValue, uuid } from '../utils';

export class Game {
  public readonly index: number;
  private players: Player[] = [];
  public isSingleGame: boolean;
  public turn: Player;
  public gameOver: boolean = false;
  public winner: User | null = null;

  constructor(players: User[], isSingleGame: boolean) {
    const [user1, user2] = players;
    const player1: Player = {
      user: user1,
      shipsPosition: [],
      ships: [],
      field: this.createEmptyField(),
    };
    const player2: Player = {
      user: user2,
      shipsPosition: [],
      ships: [],
      field: this.createEmptyField(),
    };

    this.players.push(player1);
    this.players.push(player2);
    this.index = uuid();
    this.isSingleGame = isSingleGame;
    this.turn = this.getFist(player1, player2);
  }

  private createEmptyField(): Field {
    const grid = [];
    for (let i = 0; i < FIELD_SIZE; i++) {
      const row = [];
      for (let j = 0; j < FIELD_SIZE; j++) {
        row.push(null);
      }
      grid.push(row);
    }
    return grid;
  }

  private getFist(player1: Player, player2: Player): Player {
    if (player1.user.type === UserType.BOT) {
      return player2;
    }
    if (player2.user.type === UserType.BOT) {
      return player1;
    }
    return getRandomValue(player1, player2);
  }

  public isPlayersReadyToStart(): boolean {
    return this.players.every((player) => player.ships.length > 0);
  }

  public changePlayersTurn(): void {
    this.turn = this.getAnotherPlayer(this.turn);
  }

  public getTurn(): User {
    return this.turn.user;
  }

  public getPlayer(user: User): Player {
    const player = this.players.find((curr) => curr.user === user);
    if (!player) {
      throw Error(ERRORS.GAME_DATA_NOT_FOUND);
    }
    return player;
  }

  public getBot(): User {
    const player = this.players.find((player) => player.user.type === UserType.BOT);
    if (!player) {
      throw Error(ERRORS.GAME_DATA_NOT_FOUND);
    }
    return player.user;
  }

  private getAnotherPlayer(player: Player): Player {
    const index = this.players.findIndex((curr) => curr === player);
    const newIndex = index < this.players.length - 1 ? index + 1 : 0;
    return this.players[newIndex];
  }

  private getVictim(attacker: Player): Player {
    return this.getAnotherPlayer(attacker);
  }

  private placePlayersShipsOnTheField(player: Player): void {
    player.ships.forEach((ship) => {
      const { x, y } = ship.position;
      for (let i = 0; i < ship.length; i++) {
        if (ship.direction === ShipDirection.HORIZONTALLY) {
          player.field[y][x + i] = ship;
        } else {
          player.field[y + i][x] = ship;
        }
      }
    });
  }

  public addShips(user: User, shipPositions: ShipPosition[]): void {
    const player = this.getPlayer(user);
    if (!player) {
      throw Error(ERRORS.GAME_DATA_NOT_FOUND);
    }
    player.shipsPosition = shipPositions;
    player.ships = shipPositions.map((position) => new Ship(position));

    this.placePlayersShipsOnTheField(player);
  }

  public getPlayers(): Player[] {
    return this.players;
  }

  public isUserAttack(user: User): boolean {
    return this.turn.user === user;
  }

  private getKillZone(field: Field, ship: Ship): AttackResult[] {
    const killZone: AttackResult[] = [];

    const width = ship.direction === ShipDirection.HORIZONTALLY ? ship.length : SHIP_WIDTH;
    const height = ship.direction === ShipDirection.VERTICALLY ? ship.length : SHIP_WIDTH;

    const { x, y } = ship.position;

    for (let i = -1; i <= width; i++) {
      for (let j = -1; j <= height; j++) {
        if (x + i < 0 || x + i >= FIELD_SIZE || y + j < 0 || y + j >= FIELD_SIZE) {
          continue;
        }
        if (field[y + j][x + i] === null) {
          killZone.push({ x: x + i, y: y + j, status: AttackStatus.MISS });
          continue;
        }
        killZone.push({ x: x + i, y: y + j, status: AttackStatus.KILLED });
      }
    }
    return killZone;
  }

  public finishGame(loser: User, winner?: User) {
    if (winner) {
      this.winner = winner;
    } else {
      this.winner = this.getAnotherPlayer(this.getPlayer(loser)).user;
    }
    this.winner.win();
    this.gameOver = true;
  }

  public CheckGameOver(attacker: Player, victim: Player): void {
    const isGameOver = victim.ships.every((ship) => ship.isDestroyed);
    if (isGameOver) {
      this.finishGame(victim.user, attacker.user);
    }
  }

  public attack(user: User, x: number, y: number): AttackResult[] {
    const attacker = this.getPlayer(user);
    if (!attacker) {
      throw Error(ERRORS.GAME_DATA_NOT_FOUND);
    }

    const victim = this.getVictim(attacker);
    if (!victim) {
      throw Error(ERRORS.GAME_DATA_NOT_FOUND);
    }

    const ship = victim.field[y][x];

    if (!ship) {
      this.changePlayersTurn();
      return [{ x, y, status: AttackStatus.MISS }];
    }

    const status = ship.shot();

    if (status === AttackStatus.SHOT) {
      return [{ x, y, status }];
    }

    this.CheckGameOver(attacker, victim);

    return this.getKillZone(victim.field, ship);
  }
}
