import { UserModel } from "@prisma/client";
import { inject, injectable } from "inversify";
import { IConfigService } from "../config/config-service-interface";
import { INJECT_TYPES } from "../types.js";
import { UserLoginDto } from "./dto/user-login-dto";
import { UserRegisterDto } from "./dto/user-register-dto";
import { User } from "./user-entity.js";
import { IUserRepository } from "./user-repository-interface";
import { IUserService } from "./user-service-interface";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(INJECT_TYPES.IConfigService) private configService: IConfigService,
    @inject(INJECT_TYPES.IUserRepository)
    private userRepository: IUserRepository,
  ) {}

  async createUser({
    email,
    name,
    password,
  }: UserRegisterDto): Promise<UserModel | null> {
    const newUser = new User(email, name);
    const salt = this.configService.get("SALT");
    await newUser.setPassword(password, Number(salt));

    const existedUser = await this.userRepository.find(email);
    if (existedUser) {
      return null;
    }

    return this.userRepository.create(newUser);
  }

  async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
    const existedUser = await this.userRepository.find(email);
    if (!existedUser) {
      return false;
    }

    const newUser = new User(
      existedUser.email,
      existedUser.name,
      existedUser.password,
    );

    return newUser.comparePassword(password);
  }

  async getUserInfo(email: string): Promise<UserModel | null> {
    return this.userRepository.find(email);
  }
}
