import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { ILogger } from "../logger/logger-interface";
import { TYPES } from "../di/types";
import { IExceptionFilter } from "./exception-filter-interface";
import { HTTPError } from "./http-error";

@injectable()
export class ExceptionFilter implements IExceptionFilter {
  constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

  catch(
    err: Error | HTTPError,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ): void {
    const log =
      err.constructor === HTTPError
        ? {
            statusCode: err.statusCode,
            title: err.context,
          }
        : {
            statusCode: 500,
            title: "Internal error",
          };
    this.logger.error(`[${log.statusCode}] ${log.title}: ${err.message}`);
    res.status(log.statusCode).send({ err: err.message });
  }
}
