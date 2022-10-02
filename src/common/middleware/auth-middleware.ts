import { Request, Response, NextFunction } from "express";
import { IMiddleware } from "./middleware-interface";
import { verify } from "jsonwebtoken";
import { IHttp } from "../http-interface";

export class AuthMiddleware implements IHttp {
export class AuthMiddleware implements IMiddleware {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  execute(req: Request, _res: Response, next: NextFunction): void {
    if (req.headers.authorization) {
      verify(
        req.headers.authorization.split(" ")[1],
        this.secret,
        (_err, payload) => {
          if (payload && typeof payload !== "string") {
            req.user = payload.email;
          }
        },
      );
    }
    next();
  }
}
