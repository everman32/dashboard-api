import express, { Express } from "express";
import { Server } from "http";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { IExceptionFilter } from "./errors/exception-filter-interface";
import { ILogger } from "./logger/logger-interface";
import { TYPES } from "./di/types";
import { IUserController } from "./users/user-controller-interface";
import { DatabaseService } from "./database/database-service";
import { AuthMiddleware } from "./common/auth-middleware";
import { IEnvService } from "./config/env-service-interface";
import { json } from "body-parser";

@injectable()
export class App {
  private app: Express;
  private server: Server;
  private port: number;

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.IUserController)
    private userController: IUserController,
    @inject(TYPES.DatabaseService)
    private databaseService: DatabaseService,
    @inject(TYPES.IExceptionFilter)
    private exceptionFilter: IExceptionFilter,
    @inject(TYPES.IEnvService)
    private configService: IEnvService,
  ) {
    this.app = express();
    this.port = this.configService.getNumber("PORT");
  }

  private useRoutes(): void {
    this.app.use("/users", this.userController.router);
  }

  private useMiddlewares(): void {
    this.app.use(json());

    const authMiddleware = new AuthMiddleware(
      this.configService.getString("SECRET"),
    );
    this.app.use(authMiddleware.execute.bind(authMiddleware));
  }

  private useExceptionFilters(): void {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  async init(): Promise<void> {
    this.useMiddlewares();
    this.useRoutes();
    this.useExceptionFilters();

    await this.databaseService.connect();
    this.server = this.app.listen(this.port, () => {
      this.logger.log(`Server is running at port ${this.port}`);
    });
  }

  close(): void {
    this.server.close((err) => {
      if (err) {
        this.logger.log(`Server closing is failed. ${err.message}`);
      } else {
        this.logger.log(`Server is closed`);
      }
    });
  }
}
