import { Response, Router } from "express";
import { injectable } from "inversify";
import { IRoute } from "./route-interface";

@injectable()
export abstract class BaseController {
  router: Router;
  constructor() {
    this.router = Router();
  }

  private send<T>(
    res: Response,
    code: number,
    message: T
  ): Response<unknown, Record<string, unknown>> {
    res.type("application/json");
    return res.status(code).json(message);
  }

  protected sendOk<T>(
    res: Response,
    message: T
  ): Response<unknown, Record<string, unknown>> {
    return this.send<T>(res, 200, message);
  }

  protected sendCreated<T>(
    res: Response,
    message: T
  ): Response<unknown, Record<string, unknown>> {
    return this.send<T>(res, 201, message);
  }

  protected bindRoutes(routes: IRoute[]): void {
    routes.forEach((route) => {
      const [first, ...others] = route.handlers;
      const handler = first.bind(this);
      const middlewares = others?.map((o) => o.execute.bind(o));
      const pipeline = middlewares ? [...middlewares, handler] : handler;
      this.router[route.method](route.path, pipeline);
    });
  }
}
