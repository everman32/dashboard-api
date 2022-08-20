import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app.js";
import { IExceptionFilter } from "./errors/exception-filter-interface.js";
import { ExceptionFilter } from "./errors/exception-filter.js";
import { ILogger } from "./logger/logger-interface.js";
import { LoggerService } from "./logger/logger-service.js";
import { INJECT_TYPES } from "./types.js";
import { IUserController } from "./users/user-controller-interface.js";
import { UserController } from "./users/user-controller.js";

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(INJECT_TYPES.ILogger).to(LoggerService);
  bind<IExceptionFilter>(INJECT_TYPES.IExceptionFilter).to(ExceptionFilter);
  bind<IUserController>(INJECT_TYPES.IUserController).to(UserController);
  bind<App>(INJECT_TYPES.App).to(App);
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
