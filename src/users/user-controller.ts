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
import { IConfigService } from "../config/config-service-interface.js";
import pkg from "jsonwebtoken";
const { sign } = pkg;

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(
    @inject(INJECT_TYPES.ILogger) private loggerService: ILogger,
    @inject(INJECT_TYPES.IUserService) private userService: IUserService,
    @inject(INJECT_TYPES.IConfigService) private configService: IConfigService,
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
      {
        path: "/info",
        method: "get",
        func: this.info,
      },
    ]);
  }

  async login(
    req: Request<{}, {}, UserLoginDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.userService.validateUser(req.body);
    if (!result) {
      return next(new HTTPError(401, "Authorization error"));
    }
    const jwt = await this.signJWT(
      req.body.email,
      this.configService.get("SECRET"),
    );
    this.ok(res, { jwt });
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
    this.ok(res, { email: result.email, id: result.id });
  }

  async info(
    { user }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const userInfo = await this.userService.getUserInfo(user);
    this.ok(res, { email: userInfo?.email, id: userInfo?.id });
  }

  private signJWT(email: string, secret: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      sign(
        {
          email,
          iat: Math.floor(Date.now() / 1000),
        },
        secret,
        {
          algorithm: "HS256",
        },
        (err, token) => {
          if (err) {
            reject(err);
          }
          resolve(token as string);
        },
      );
    });
  }
}
