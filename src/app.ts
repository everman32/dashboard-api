import e, { Express } from "express";
import { Server } from "http";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { IExceptionFilter } from "./errors/exception-filter-interface";
import { ILogger } from "./logger/logger-interface";
import { TYPES } from "./di/types";
import { IUserController } from "./users/user-controller-interface";
import { DatabaseService } from "./database/database-service";
import { AuthMiddleware } from "./common/auth-middleware";
import { IConfigService } from "./config/config-service-interface";
import { json } from "body-parser";

@injectable()
export class App {
  app: Express;
  server: Server;
  port: number;

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.IUserController)
    private userController: IUserController,
    @inject(TYPES.DatabaseService)
    private databaseService: DatabaseService,
    @inject(TYPES.IExceptionFilter)
    private exceptionFilter: IExceptionFilter,
    @inject(TYPES.IConfigService)
    private configService: IConfigService,
  ) {
    this.app = e();
    this.port = this.configService.getNumber("PORT");
  }

  useRoutes(): void {
    this.app.use("/users", this.userController.router);
  }

  useMiddlewares(): void {
    this.app.use(json());
      this.configService.getString("SECRET"),
    this.app.use(authMiddleware.execute.bind(authMiddleware));
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

  public close(): void {
    this.server.close();
  }
}
