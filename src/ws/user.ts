export class User {
  public readonly index: number;
  public readonly name: string;
  private readonly password: string;
  public wins: number = 0;

  constructor(name: string, password: string, index: number) {
    this.name = name;
    this.password = password;
    this.index = index;
  }
}
