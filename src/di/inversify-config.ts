import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "../app";
import { EnvService } from "../config/env-service";
import { IEnvService } from "../config/env-service-interface";
import { DatabaseService } from "../database/database-service";
import { ExceptionFilter } from "../errors/exception-filter";
import { IExceptionFilter } from "../errors/exception-filter-interface";
import { ILogger } from "../logger/logger-interface";
import { LoggerService } from "../logger/logger-service";
import { UserController } from "../users/user-controller";
import { IUserController } from "../users/user-controller-interface";
import { UserRepository } from "../users/user-repository";
import { IUserRepository } from "../users/user-repository-interface";
import { UserService } from "../users/user-service";
import { IUserService } from "../users/user-service-interface";
import { TYPES } from "./types";

const bindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
  bind<IExceptionFilter>(TYPES.IExceptionFilter)
    .to(ExceptionFilter)
    .inSingletonScope();
  bind<IUserController>(TYPES.IUserController)
    .to(UserController)
    .inSingletonScope();
  bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
  bind<IUserRepository>(TYPES.IUserRepository)
    .to(UserRepository)
    .inSingletonScope();
  bind<DatabaseService>(TYPES.DatabaseService)
    .to(DatabaseService)
    .inSingletonScope();
  bind<IEnvService>(TYPES.IEnvService).to(EnvService).inSingletonScope();
  bind<App>(TYPES.App).to(App).inSingletonScope();
});

const container = new Container();
container.load(bindings);

export { container };
