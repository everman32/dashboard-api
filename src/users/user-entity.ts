import { hash, compare } from "bcryptjs";

export class User {
  private _password: string;
  constructor(
    private readonly _email: string,
    private readonly _name: string,
    passwordHash?: string,
  ) {
    if (passwordHash) {
      this._password = passwordHash;
    }
  }

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get password(): string {
    return this._password;
  }

  async setPassword(pass: string, salt: number): Promise<void> {
    this._password = await hash(pass, salt);
  }

  async comparePassword(pass: string): Promise<boolean> {
    return await compare(pass, this._password);
  }
}
