import { WebSocket } from 'ws';

import { Game } from './game';
import { Room } from './room';
import { User } from './user';

const TWO_PLAYERS = 2;
export class DataBase {
  private users: User[] = [];
  private rooms: Room[] = [];
  private games: Game[] = [];
  private maxRoomNumber: number = 0;
  private maxGameNumber: number = 0;

  public createNewUser(name: string, password: string, connection: WebSocket) {
    const newUser = new User(name, password, this.users.length, connection);
    this.users.push(newUser);
    return newUser;
  }

  public getWinners() {
    return this.users;
  }

  private getRoomPlayers(room: Room) {
    return room.players.map((player) => ({ name: player.name, index: player.index }));
  }

  public getRooms() {
    return this.rooms;
  }

  public createNewRoom(user: User) {
    const newRoom = new Room(user, this.maxRoomNumber++);
    this.rooms.push(newRoom);
  }

  public addUserToRoom(user: User, roomIndex: number) {
    const room = this.rooms.find((room) => room.index === roomIndex);
    if (!room) {
      return null;
    }
    room.addPlayer(user);
    return room;
  }

  private deleteRoom(room: Room) {
    this.rooms = this.rooms.filter((curr) => curr !== room);
  }

  public isPlayersReady(room: Room) {
    return room.players.length === TWO_PLAYERS;
  }

  public createNewGame(user: User, room: Room) {
    const newGame = new Game(room.players, this.maxGameNumber++);
    this.games.push(newGame);
    this.deleteRoom(room);
    return newGame;
  }

  public getGameById(id: number) {
    return this.games.find((game) => game.index === id);
  }
}
