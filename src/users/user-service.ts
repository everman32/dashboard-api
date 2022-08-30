import { UserModel } from "@prisma/client";
import { inject, injectable } from "inversify";
import { IEnvService } from "../config/env-service-interface";
import { TYPES } from "../di/types";
import { UserLoginDto } from "./dto/user-login-dto";
import { UserRegisterDto } from "./dto/user-register-dto";
import { User } from "./user-entity";
import { IUserRepository } from "./user-repository-interface";
import { IUserService } from "./user-service-interface";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.IEnvService) private configService: IEnvService,
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository,
  ) {}

  async createUser({
    email,
    name,
    password,
  }: UserRegisterDto): Promise<UserModel | null> {
    const newUser = new User(email, name);
    await newUser.setPassword(password, this.configService.getNumber("SALT"));

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
    return await this.userRepository.find(email);
  }
}
