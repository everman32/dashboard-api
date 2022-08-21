import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseController } from "../common/base-controller.js";
import { ILogger } from "../logger/logger-interface.js";
import { INJECT_TYPES } from "../types.js";
import "reflect-metadata";
import { IUserController } from "./user-controller-interface.js";
import { UserRegisterDto } from "./dto/user-register-dto.js";
import { UserLoginDto } from "./dto/user-login-dto.js";

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(@inject(INJECT_TYPES.ILogger) private loggerService: ILogger) {
    super(loggerService);

    this.bindRoutes([
      { path: "/register", method: "post", func: this.register },
      { path: "/login", method: "post", func: this.login },
    ]);
  }

  login(
    req: Request<{}, {}, UserLoginDto>,
    res: Response,
    next: NextFunction,
  ): void {
    this.ok(res, "login");
  }

  register(
    req: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction,
  ): void {
    this.ok(res, "register");
  }
}
