import { Request, Response, NextFunction } from "express";
import { ClassConstructor, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { IHttp } from "../http-interface";

export class DtoMiddleware implements IHttp {
  private classToValidate: ClassConstructor<object>;

  constructor(classToValidate: ClassConstructor<object>) {
    this.classToValidate = classToValidate;
  }

  execute({ body }: Request, res: Response, next: NextFunction): void {
    const instance = plainToClass(this.classToValidate, body);

    validate(instance).then((errors) => {
      if (errors.length > 0) {
        return res.status(422).send(errors[0].constraints);
      }
      next();
    });
  }
}
