import { Response, Router } from "express";
import { injectable } from "inversify";
import { ILogger } from "../logger/logger-interface.js";
import { ExpressReturnType, IRoute } from "./route-interface.js";
import "reflect-metadata";

@injectable()
export abstract class BaseController {
  router: Router;
  constructor(private logger: ILogger) {
    this.router = Router();
  }

  send<T>(res: Response, code: number, message: T): ExpressReturnType {
    res.type("application/json");
    return res.status(code).json(message);
  }

  ok<T>(res: Response, message: T): ExpressReturnType {
    return this.send<T>(res, 200, message);
  }

  created(res: Response): ExpressReturnType {
    return res.sendStatus(201);
  }

  bindRoutes(routes: IRoute[]): void {
    routes.forEach((route) => {
      this.logger.log(`[${route.method}] ${route.path}`);
      const middleware = route.middlewares?.map((m) => m.execute.bind(m));
      const handler = route.func.bind(this);
      const pipeline = middleware ? [...middleware, handler] : handler;
      this.router[route.method](route.path, pipeline);
    });
  }
}
