import { WebSocket } from 'ws';

import { Game } from './game';
import { Room } from './room';
import { User } from './user';
import { ERRORS } from '../const';
import { RoomStatus } from './types';

const TWO_PLAYERS = 2;
export class DataBase {
  private users: User[] = [];
  private rooms: Room[] = [];
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

  public getRooms() {
    return this.rooms;
  }

  public createNewRoom(user: User) {
    const newRoom = new Room(user, this.maxRoomNumber++);
    this.rooms.push(newRoom);
  }

  public addUserToRoom(user: User, roomIndex: number): Room {
    const room = this.rooms.find((room) => room.index === roomIndex);
    if (!room) {
      throw Error(ERRORS.GAME_DATA_NOT_FOUND);
    }
    room.addPlayer(user);
    return room;
  }

  public isPlayersReady(room: Room): boolean {
    return room.players.length === TWO_PLAYERS;
  }

  public createNewGame(room: Room): Game {
    return room.createNewGame(this.maxGameNumber++);
  }

  public getGameById(id: number): Game {
    const room = this.rooms
      .filter((room) => room.status === RoomStatus.CLOSE)
      .find((room) => room.game?.index === id);
    if (!room?.game) {
      throw Error(ERRORS.GAME_DATA_NOT_FOUND);
    }
    return room.game;
  }
}
