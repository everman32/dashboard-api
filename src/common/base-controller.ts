import { Response, Router } from "express";
import { injectable } from "inversify";
import { ResponseType, IRoute } from "./route-interface";

@injectable()
export abstract class BaseController {
  router: Router;
  constructor() {
    this.router = Router();
  }

  private send<T>(res: Response, code: number, message: T): ResponseType {
    res.type("application/json");
    return res.status(code).json(message);
  }

  protected ok<T>(res: Response, message: T): ResponseType {
    return this.send<T>(res, 200, message);
  }

  protected created<T>(res: Response, message: T): ResponseType {
    return this.send<T>(res, 201, message);
  }

  protected bindRoutes(routes: IRoute[]): void {
    routes.forEach((route) => {
      const middleware = route.middlewares?.map((m) => m.execute.bind(m));
      const pipeline = middleware ? [...middleware, route.func] : route.func;
      this.router[route.method](route.path, pipeline);
    });
  }
}
