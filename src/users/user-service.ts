import { inject, injectable } from "inversify";
import { IConfigService } from "../config/config-service-interface";
import { INJECT_TYPES } from "../types.js";
import { UserLoginDto } from "./dto/user-login-dto";
import { UserRegisterDto } from "./dto/user-register-dto";
import { User } from "./user-entity.js";
import { IUserService } from "./user-service-interface";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(INJECT_TYPES.IConfigService) private configService: IConfigService,
  ) {}

  async createUser({
    email,
    name,
    password,
  }: UserRegisterDto): Promise<User | null> {
    const newUser = new User(email, name);
    const salt = this.configService.get("SALT");
    await newUser.setPassword(password, Number(salt));
    return null;
  }

  async validateUser(dto: UserLoginDto): Promise<boolean> {
    return true;
  }
}
