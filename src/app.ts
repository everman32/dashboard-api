import e, { Express } from "express";
import { Server } from "http";
import { inject, injectable } from "inversify";
import { IExceptionFilter } from "./errors/exception-filter-interface.js";
import { ILogger } from "./logger/logger-interface.js";
import { INJECT_TYPES } from "./types.js";
import { UserController } from "./users/user-controller.js";
import "reflect-metadata";

@injectable()
export class App {
  app: Express;
  server: Server;
  port: number;

  constructor(
    @inject(INJECT_TYPES.ILogger) private logger: ILogger,
    @inject(INJECT_TYPES.UserController) private userController: UserController,
    @inject(INJECT_TYPES.IExceptionFilter)
    private exceptionFilter: IExceptionFilter,
  ) {
    this.app = e();
    this.port = 8000;
  }

  useRoutes() {
    this.app.use("/users", this.userController.router);
  }

  useExceptionFilters() {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.useRoutes();
    this.useExceptionFilters();
    this.server = this.app.listen(this.port);
    this.logger.log(`Server is running at port ${this.port}`);
  }
}
