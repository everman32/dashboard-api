import { Response, Router } from "express";
import { injectable } from "inversify";
import { ILogger } from "../logger/logger-interface.js";
import { IRoute } from "./route-interface.js";
import "reflect-metadata";

@injectable()
export abstract class BaseController {
  router: Router;
  constructor(private logger: ILogger) {
    this.router = Router();
  }

  send<T>(res: Response, code: number, message: T) {
    res.type("application/json");
    return res.status(code).json(message);
  }

  ok<T>(res: Response, message: T) {
    return this.send<T>(res, 200, message);
  }

  created(res: Response) {
    return res.sendStatus(201);
  }

  bindRoutes(routes: IRoute[]) {
    routes.forEach((route) => {
      this.logger.log(`[${route.method}] ${route.path}`);
      const handler = route.func.bind(this);
      this.router[route.method](route.path, handler);
    });
  }
}
