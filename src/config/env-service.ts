import "dotenv/config";
import { config, DotenvConfigOutput, DotenvParseOutput } from "dotenv";
import { IEnvService } from "./env-service-interface";
import { TYPES } from "../di/types";
import { ILogger } from "../logger/logger-interface";
import { inject, injectable } from "inversify";

@injectable()
export class EnvService implements IEnvService {
  private config: DotenvParseOutput;

  constructor(@inject(TYPES.ILogger) private logger: ILogger) {
    const result: DotenvConfigOutput = config();

    if (result.error) {
      this.logger.error("The .env file could not be read or is missing");
    } else {
      this.logger.log("Config .env loaded");
      this.config = result.parsed as DotenvParseOutput;
    }
  }

  getString(key: string): string {
    return this.config[key];
  }

  getNumber(key: string): number {
    return Number(this.getString(key));
  }
}
