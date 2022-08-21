import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app.js";
import { IConfigService } from "./config/config-service-interface.js";
import { ConfigService } from "./config/config-service.js";
import { IExceptionFilter } from "./errors/exception-filter-interface.js";
import { ExceptionFilter } from "./errors/exception-filter.js";
import { ILogger } from "./logger/logger-interface.js";
import { LoggerService } from "./logger/logger-service.js";
import { INJECT_TYPES } from "./types.js";
import { IUserController } from "./users/user-controller-interface.js";
import { UserController } from "./users/user-controller.js";
import { IUserService } from "./users/user-service-interface.js";
import { UserService } from "./users/user-service.js";

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
  bind<IConfigService>(INJECT_TYPES.IConfigService).to(ConfigService);
  bind<App>(INJECT_TYPES.App).to(App).inSingletonScope();
});

export interface IBootstrapReturn {
  appContainer: Container;
  app: App;
}

const bootstrap = (): IBootstrapReturn => {
  const appContainer = new Container();
  appContainer.load(appBindings);

  const app = appContainer.get<App>(INJECT_TYPES.App);
  app.init();

  return { app, appContainer };
};

export const { app, appContainer } = bootstrap();
