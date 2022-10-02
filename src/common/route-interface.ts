import { Request, Response, Router, NextFunction } from "express";
import { IHttp } from "./http-interface";

export interface IRoute {
  path: string;
  method: keyof Pick<Router, "get" | "post" | "delete" | "patch" | "put">;
  handlers: [func, ...IHttp[]];
}

type func = (req: Request, res: Response, next: NextFunction) => Promise<void>;
