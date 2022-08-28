import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseController } from "../common/base-controller";
import { ILogger } from "../logger/logger-interface";
import { TYPES } from "../di/types";
import { IUserController } from "./user-controller-interface";
import { UserRegisterDto } from "./dto/user-register-dto";
import { UserLoginDto } from "./dto/user-login-dto";
import { IUserService } from "./user-service-interface";
import { HTTPError } from "../errors/http-error";
import { ValidateMiddleware } from "../common/validate-middleware";
import { IConfigService } from "../config/config-service-interface";
import { AuthGuard } from "../common/auth-guard";
import { sign } from "jsonwebtoken";

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.IUserService) private userService: IUserService,
    @inject(TYPES.IConfigService) private configService: IConfigService,
  ) {
    super(loggerService);

    this.bindRoutes([
      {
        path: "/register",
        method: "post",
        func: this.register.bind(this),
        middlewares: [new ValidateMiddleware(UserRegisterDto)],
      },
      {
        path: "/login",
        method: "post",
        func: this.login.bind(this),
        middlewares: [new ValidateMiddleware(UserLoginDto)],
      },
      {
        path: "/info",
        method: "get",
        func: this.info.bind(this),
        middlewares: [new AuthGuard()],
      },
    ]);
  }

  async login(
    req: Request<unknown, Record<string, unknown>, UserLoginDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.userService.validateUser(req.body);
    if (!result) {
      return next(new HTTPError(401, "Authorization error", "Login"));
    }
    const jwt = await this.signJWT(
      req.body.email,
      this.configService.getString("SECRET"),
    );
    this.ok(res, { jwt });
  }

  async register(
    { body }: Request<unknown, Record<string, unknown>, UserRegisterDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.userService.createUser(body);

    if (!result) {
      return next(
        new HTTPError(422, "This user already exists", "Registration"),
      );
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
