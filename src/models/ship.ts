import { AttackStatus, ShipDirection, ShipPosition } from '../types';

export class Ship {
  public readonly position: {
    x: number;
    y: number;
  };
  public readonly direction: ShipDirection;
  public readonly length: number;
  public isDestroyed: boolean = false;
  private hitCount: number = 0;

  constructor(params: ShipPosition) {
    this.position = params.position;
    this.direction = params.direction ? ShipDirection.VERTICALLY : ShipDirection.HORIZONTALLY;
    this.length = params.length;
  }

  public shot(): AttackStatus {
    this.hitCount += 1;
    if (this.hitCount >= this.length) {
      this.isDestroyed = true;
      return AttackStatus.KILLED;
    }
    return AttackStatus.SHOT;
  }
}
