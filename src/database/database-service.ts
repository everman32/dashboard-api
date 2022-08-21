import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import { ILogger } from "../logger/logger-interface";
import { INJECT_TYPES } from "../types.js";

@injectable()
export class DatabaseService {
  client: PrismaClient;

  constructor(@inject(INJECT_TYPES.ILogger) private logger: ILogger) {
    this.client = new PrismaClient();
  }

  async connect(): Promise<void> {
    try {
      await this.client.$connect();
      this.logger.log("Connected to database");
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(`Failed to connect to database: ${e.message}`);
      }
    }
  }

  async disconnect(): Promise<void> {
    await this.client.$disconnect();
  }
}
