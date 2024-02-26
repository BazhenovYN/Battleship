import { WebSocket } from 'ws';
import { hash } from '../utils';
import { UserType } from '../types';

export class User {
  public type: UserType;
  public index: number;
  public readonly name: string;
  public wins: number = 0;
  public connection?: WebSocket | null;
  private readonly password: string;

  constructor(
    type: UserType,
    id: number,
    name: string,
    password: string = '',
    connection?: WebSocket
  ) {
    this.type = type;
    this.index = id;
    this.name = name;
    this.password = hash(password);
    this.connection = connection;
  }

  public win(): void {
    this.wins += 1;
  }

  public isPasswordValid(password: string): boolean {
    return this.password === hash(password);
  }

  public updateConnection(connection: WebSocket, id: number) {
    this.index = id;
    this.connection = connection;
  }

  public closeConnection() {
    this.connection = null;
  }
}
