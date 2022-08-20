import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ILogger } from "../logger/logger-interface.js";
import { INJECT_TYPES } from "../types.js";
import { IExceptionFilter } from "./exception-filter-interface.js";
import { HTTPError } from "./http-error.js";
import "reflect-metadata";

@injectable()
export class ExceptionFilter implements IExceptionFilter {
  constructor(@inject(INJECT_TYPES.ILogger) private logger: ILogger) {}

  catch(err: Error | HTTPError, req: Request, res: Response): void {
    if (err instanceof HTTPError) {
      this.logger.error(
        `[${err.context}] Error ${err.statusCode}: ${err.message}`,
      );
      res.status(err.statusCode).send({ err: err.message });
    } else {
      this.logger.error(`${err.message}`);
      res.status(500).send({ err: err.message });
    }
  }
}
