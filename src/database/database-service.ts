import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import { ILogger } from "../logger/logger-interface";
import { TYPES } from "../di/types";

@injectable()
export class DatabaseService {
  client: PrismaClient;

  constructor(@inject(TYPES.ILogger) private logger: ILogger) {
    this.client = new PrismaClient();
  }

  async connect(): Promise<void> {
    try {
      await this.client.$connect();
      this.logger.log("Connected to database");
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(`Failed to connect to database: ${err.message}`);
      }
    }
  }

  async disconnect(): Promise<void> {
    await this.client.$disconnect();
  }
}
