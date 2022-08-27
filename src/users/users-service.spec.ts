/* eslint-disable sonarjs/no-duplicate-string */
import { UserModel } from "@prisma/client";
import { Container } from "inversify";
import "reflect-metadata";
import { IConfigService } from "../config/config-service-interface";
import { User } from "./user-entity";
import { IUserRepository } from "./user-repository-interface";
import { IUserService } from "./user-service-interface";
import { UserService } from "./user-service";
import { TYPES } from "../di/types";

const ConfigServiceMock: IConfigService = {
  getNumber: jest.fn(),
  getString: jest.fn(),
};

const UsersRepositoryMock: IUserRepository = {
  find: jest.fn(),
  create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let userRepository: IUserRepository;
let userService: IUserService;

beforeAll(() => {
  container
    .bind<IConfigService>(TYPES.IConfigService)
    .toConstantValue(ConfigServiceMock);
  container
    .bind<IUserRepository>(TYPES.IUserRepository)
    .toConstantValue(UsersRepositoryMock);
  container.bind<IUserService>(TYPES.IUserService).to(UserService);

  configService = container.get<IConfigService>(TYPES.IConfigService);
  userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
  userService = container.get<IUserService>(TYPES.IUserService);
});

let createdUser: UserModel | null;

describe("User Service", () => {
  it("createUser", async () => {
    configService.getString = jest.fn().mockReturnValueOnce("1");
    configService.getNumber = jest.fn().mockReturnValueOnce(1);

    userRepository.create = jest.fn().mockImplementationOnce(
      (user: User): UserModel => ({
        email: user.email,
        name: user.name,
        password: user.password,
        id: 1,
      }),
    );
    createdUser = await userService.createUser({
      email: "alex@gmail.com",
      name: "Alex",
      password: "Alex123",
    });

    expect(createdUser?.id).toEqual(1);
    expect(createdUser?.password).not.toEqual("1");
  });

  it("validateUser - success", async () => {
    userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
    const res = await userService.validateUser({
      email: "alex@gmail.com",
      password: "Alex123",
    });

    expect(res).toBeTruthy();
  });

  it("validateUser - wrong password", async () => {
    userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
    const res = await userService.validateUser({
      email: "alex@gmail.com",
      password: "Alex12",
    });

    expect(res).toBeFalsy();
  });

  it("validateUser - wrong user", async () => {
    userRepository.find = jest.fn().mockReturnValueOnce(null);
    const res = await userService.validateUser({
      email: "alex@gmail.com",
      password: "Alex123",
    });

    expect(res).toBeFalsy();
  });
});
