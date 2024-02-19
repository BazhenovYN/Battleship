import { createHash } from 'node:crypto';
import type { WebSocket } from 'ws';

const hash = (data: string): string => {
  return createHash('sha256').update(data).digest('hex');
};

export class User {
  public readonly index: number;
  public readonly name: string;
  public wins: number = 0;
  public connection: WebSocket;
  private readonly password: string;

  constructor(name: string, password: string, index: number, connection: WebSocket) {
    this.name = name;
    this.password = hash(password);
    this.index = index;
    this.connection = connection;
  }

  public win() {
    this.wins += 1;
    return this.wins;
  }
}
