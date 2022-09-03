import { NextFunction, Request, Response, Router } from "express";
import { IMiddleware } from "./middleware/middleware-interface";

export interface IRoute {
  path: string;
  func: (req: Request, res: Response, next: NextFunction) => void;
  method: keyof Pick<Router, "get" | "post" | "delete" | "patch" | "put">;
  middlewares?: IMiddleware[];
}

export type ResponseType = Response<unknown, Record<string, unknown>>;
