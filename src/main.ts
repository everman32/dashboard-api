import { Container } from "inversify";
import { App } from "./app.js";
import { IExceptionFilter } from "./errors/exception-filter-interface.js";
import { ExceptionFilter } from "./errors/exception-filter.js";
import { ILogger } from "./logger/logger-interface.js";
import { LoggerService } from "./logger/logger-service.js";
import { INJECT_TYPES } from "./types.js";
import { UserController } from "./users/user-controller.js";

/*
const bootstrap = async () => {
  const logger = new LoggerService();
  const app = new App(
    logger,
    new UserController(logger),
    new ExceptionFilter(logger),
  );
  await app.init();
};
*/
// bootstrap();

const appContainer = new Container();
appContainer.bind<ILogger>(INJECT_TYPES.ILogger).to(LoggerService);
appContainer
  .bind<IExceptionFilter>(INJECT_TYPES.IExceptionFilter)
  .to(ExceptionFilter);
appContainer
  .bind<UserController>(INJECT_TYPES.UserController)
  .to(UserController);
appContainer.bind<App>(INJECT_TYPES.App).to(App);
const app = appContainer.get<App>(INJECT_TYPES.App);
app.init();

export { app, appContainer };
