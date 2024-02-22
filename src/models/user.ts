import { WebSocket } from 'ws';
import { hash } from '../utils';

export class User {
  public index: number;
  public readonly name: string;
  public wins: number = 0;
  public connection: WebSocket;
  private readonly password: string;

  constructor(name: string, password: string, connection: WebSocket, id: number) {
    this.name = name;
    this.password = hash(password);
    this.index = id;
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
}
