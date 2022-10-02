import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseController } from "../common/base-controller";
import { TYPES } from "../di/types";
import { IUserController } from "./user-controller-interface";
import { UserRegisterDto } from "./dto/user-register-dto";
import { UserLoginDto } from "./dto/user-login-dto";
import { IUserService } from "./user-service-interface";
import { HTTPError } from "../errors/http-error";
import { DtoMiddleware } from "../common/middleware/dto-middleware";
import { IEnvService } from "../config/env-service-interface";
import { AuthResolver } from "../common/middleware/auth-resolver";

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(
    @inject(TYPES.IUserService) private userService: IUserService,
    @inject(TYPES.IEnvService) private envService: IEnvService,
  ) {
    super();

    this.bindRoutes([
      {
        path: "/register",
        method: "post",
        handlers: [
          this.register.bind(this),
          new DtoMiddleware(UserRegisterDto),
        ],
      },
      {
        path: "/login",
        method: "post",
        handlers: [this.login.bind(this), new DtoMiddleware(UserLoginDto)],
      },
      {
        path: "/info",
        method: "get",
        handlers: [this.info.bind(this), new AuthResolver()],
      },
    ]);
  }

  async login(
    { body }: Request<unknown, Record<string, unknown>, UserLoginDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.userService.validateUser(body);
    if (!result) {
      return next(new HTTPError(401, "Wrong login or password", "Login"));
    }

    const jwt = this.userService.signJWT(
      body.email,
      this.envService.getString("SECRET"),
    );

    this.sendOk(res, { jwt });
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

    this.sendCreated(res, { id: result.id });
  }

  async info({ user }: Request, res: Response): Promise<void> {
    const userInfo = await this.userService.getUserInfo(user);

    this.sendOk(res, { email: userInfo?.email });
  }
}
