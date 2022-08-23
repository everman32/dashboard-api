import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseController } from "../common/base-controller.js";
import { ILogger } from "../logger/logger-interface.js";
import { INJECT_TYPES } from "../types.js";
import "reflect-metadata";
import { IUserController } from "./user-controller-interface.js";
import { UserRegisterDto } from "./dto/user-register-dto.js";
import { UserLoginDto } from "./dto/user-login-dto.js";
import { IUserService } from "./user-service-interface.js";
import { HTTPError } from "../errors/http-error.js";
import { ValidateMiddleware } from "../common/validate-middleware.js";

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(
    @inject(INJECT_TYPES.ILogger) private loggerService: ILogger,
    @inject(INJECT_TYPES.IUserService) private userService: IUserService,
  ) {
    super(loggerService);

    this.bindRoutes([
      {
        path: "/register",
        method: "post",
        func: this.register,
        middlewares: [new ValidateMiddleware(UserRegisterDto)],
      },
      {
        path: "/login",
        method: "post",
        func: this.login,
        middlewares: [new ValidateMiddleware(UserLoginDto)],
      },
    ]);
  }

  login(
    req: Request<{}, {}, UserLoginDto>,
    res: Response,
    next: NextFunction,
  ): void {
    this.loggerService.log("login");
    this.ok(res, "login");
  }

  async register(
    { body }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.userService.createUser(body);

    if (!result) {
      return next(new HTTPError(422, "This user already exists"));
    }
    this.ok(res, { email: result.email });
  }
}
