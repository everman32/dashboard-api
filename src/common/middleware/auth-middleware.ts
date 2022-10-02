import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { IHttp } from "../http-interface";

export class AuthMiddleware implements IHttp {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  execute(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      verify(token, this.secret, (_err, payload) => {
        if (payload && typeof payload !== "string") {
          req.user = payload.email;
        }
      });
    }
    next();
  }
}
