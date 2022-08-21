import e, { Express } from "express";
import { Server } from "http";
import { inject, injectable } from "inversify";
import { IExceptionFilter } from "./errors/exception-filter-interface.js";
import { ILogger } from "./logger/logger-interface.js";
import { INJECT_TYPES } from "./types.js";
import "reflect-metadata";
import { IUserController } from "./users/user-controller-interface.js";
import pkg from "body-parser";
import { DatabaseService } from "./database/database-service.js";
const { json } = pkg;

@injectable()
export class App {
  app: Express;
  server: Server;
  port: number;

  constructor(
    @inject(INJECT_TYPES.ILogger) private logger: ILogger,
    @inject(INJECT_TYPES.IUserController)
    private userController: IUserController,
    @inject(INJECT_TYPES.DatabaseService)
    private databaseService: DatabaseService,
    @inject(INJECT_TYPES.IExceptionFilter)
    private exceptionFilter: IExceptionFilter,
  ) {
    this.app = e();
    this.port = 8000;
  }

  useRoutes(): void {
    this.app.use("/users", this.userController.router);
  }

  useMiddlewares(): void {
    this.app.use(json());
  }

  useExceptionFilters(): void {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init(): Promise<void> {
    this.useMiddlewares();
    this.useRoutes();
    this.useExceptionFilters();
    await this.databaseService.connect();
    this.server = this.app.listen(this.port);
    this.logger.log(`Server is running at port ${this.port}`);
  }
}
