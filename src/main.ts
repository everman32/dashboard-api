import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app";
import { IConfigService } from "./config/config-service-interface";
import { ConfigService } from "./config/config-service";
import { DatabaseService } from "./database/database-service";
import { IExceptionFilter } from "./errors/exception-filter-interface";
import { ExceptionFilter } from "./errors/exception-filter";
import { ILogger } from "./logger/logger-interface";
import { LoggerService } from "./logger/logger-service";
import { INJECT_TYPES } from "./injected-types";
import { IUserController } from "./users/user-controller-interface";
import { UserController } from "./users/user-controller";
import { IUserRepository } from "./users/user-repository-interface";
import { UserRepository } from "./users/user-repository";
import { IUserService } from "./users/user-service-interface";
import { UserService } from "./users/user-service";

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(INJECT_TYPES.ILogger).to(LoggerService).inSingletonScope();
  bind<IExceptionFilter>(INJECT_TYPES.IExceptionFilter)
    .to(ExceptionFilter)
    .inSingletonScope();
  bind<IUserController>(INJECT_TYPES.IUserController)
    .to(UserController)
    .inSingletonScope();
  bind<IUserService>(INJECT_TYPES.IUserService)
    .to(UserService)
    .inSingletonScope();
  bind<IUserRepository>(INJECT_TYPES.IUserRepository)
    .to(UserRepository)
    .inSingletonScope();
  bind<DatabaseService>(INJECT_TYPES.DatabaseService)
    .to(DatabaseService)
    .inSingletonScope();
  bind<IConfigService>(INJECT_TYPES.IConfigService)
    .to(ConfigService)
    .inSingletonScope();
  bind<App>(INJECT_TYPES.App).to(App).inSingletonScope();
});

export interface IBootstrapReturn {
  appContainer: Container;
  app: App;
}

const bootstrap = async (): Promise<IBootstrapReturn> => {
  const appContainer = new Container();
  appContainer.load(appBindings);

  const app = appContainer.get<App>(INJECT_TYPES.App);
  await app.init();

  return { app, appContainer };
};

export const boot = bootstrap();
