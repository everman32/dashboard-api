import { IConfigService } from "./config-service-interface";
import "dotenv/config";
import { config, DotenvConfigOutput, DotenvParseOutput } from "dotenv";
import { INJECT_TYPES } from "../types.js";
import { ILogger } from "../logger/logger-interface";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;

  constructor(@inject(INJECT_TYPES.ILogger) private logger: ILogger) {
    const result: DotenvConfigOutput = config();

    if (result.error) {
      this.logger.error("The .env file could not be read or is missing");
    } else {
      this.logger.log("Config .env loaded");
      this.config = result.parsed as DotenvParseOutput;
    }
  }

  get(key: string): string {
    return this.config[key];
  }
}