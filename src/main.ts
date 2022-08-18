import { App } from "./app.js";
import { ExceptionFilter } from "./errors/exception-filter.js";
import { LoggerService } from "./logger/logger-service.js";
import { UserController } from "./users/user-controller.js";

const bootstrap = async () => {
  const logger = new LoggerService();
  const app = new App(
    logger,
    new UserController(logger),
    new ExceptionFilter(logger),
  );
  await app.init();
};

bootstrap();
