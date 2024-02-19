import type { WebSocket } from 'ws';
export class User {
  public readonly index: number;
  public readonly name: string;
  private readonly password: string;
  public wins: number = 0;
  public connection: WebSocket;

  constructor(name: string, password: string, index: number, connection: WebSocket) {
    this.name = name;
    this.password = password;
    this.index = index;
    this.connection = connection;
  }
}
