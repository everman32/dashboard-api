import { Request, Response, NextFunction } from "express-serve-static-core";
import { IMiddleware } from "./middleware-interface";
import pkg from "jsonwebtoken";
const { verify } = pkg as any;

export class AuthMiddleware implements IMiddleware {
  constructor(private secret: string) {}

  execute(req: Request, res: Response, next: NextFunction): void {
    if (req.headers.authorization) {
      verify(
        req.headers.authorization.split(" ")[1],
        this.secret,
        (err: any, payload: { email: string }) => {
          if (err) {
            next();
          } else if (payload) {
            req.user = payload.email;
            next();
          }
        },
      );
    } else {
      next();
    }
  }
}
