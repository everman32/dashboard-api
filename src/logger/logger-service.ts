import { injectable } from "inversify";
import { Logger } from "tslog";
import { ILogger } from "./logger-interface";

@injectable()
export class LoggerService implements ILogger {
  logger: Logger;

  constructor() {
    this.logger = new Logger({
      displayFunctionName: false,
      displayFilePath: "hidden",
    });
  }

  log(...args: unknown[]): void {
    this.logger.info(...args);
  }

  error(...args: unknown[]): void {
    this.logger.error(...args);
  }

  warn(...args: unknown[]): void {
    this.logger.warn(...args);
  }
}
