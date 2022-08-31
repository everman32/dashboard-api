import { Request, Response, NextFunction } from "express";
import { IMiddleware } from "./middleware-interface";
import { ClassConstructor, plainToClass } from "class-transformer";
import { validate } from "class-validator";

export class DtoValidateMiddleware implements IMiddleware {
  private classToValidate: ClassConstructor<object>;

  constructor(classToValidate: ClassConstructor<object>) {
    this.classToValidate = classToValidate;
  }

  execute({ body }: Request, res: Response, next: NextFunction): void {
    const instance = plainToClass(this.classToValidate, body);

    validate(instance).then((errors) => {
      if (errors.length > 0) {
        res.status(422).send(errors);
      } else {
        next();
      }
    });
  }
}
