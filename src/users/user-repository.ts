import { UserModel } from "@prisma/client";
import { inject, injectable } from "inversify";
import { DatabaseService } from "../database/database-service.js";
import { INJECT_TYPES } from "../types.js";
import { User } from "./user-entity";
import { IUserRepository } from "./user-repository-interface";

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject(INJECT_TYPES.DatabaseService)
    private databaseService: DatabaseService,
  ) {}

  async create({ email, name, password }: User): Promise<UserModel> {
    return this.databaseService.client.userModel.create({
      data: {
        email,
        name,
        password,
      },
    });
  }

  async find(email: string): Promise<UserModel | null> {
    return this.databaseService.client.userModel.findFirst({
      where: {
        email,
      },
    });
  }
}
