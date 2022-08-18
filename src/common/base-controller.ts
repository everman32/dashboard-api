import { Response, Router } from "express";
import { LoggerService } from "../logger/logger-service.js";
import { IRoute } from "./route-interface.js";

export abstract class BaseController {
  router: Router;
  constructor(private logger: LoggerService) {
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
