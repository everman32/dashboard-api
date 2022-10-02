import { NextFunction, Request, Response } from "express";
import { IHttp } from "../http-interface";

export class AuthResolver implements IHttp {
  execute(req: Request, res: Response, next: NextFunction): void {
    if (req.user) {
      return next();
    }
    res.status(401).send({ error: "You are not authorized" });
  }
}
