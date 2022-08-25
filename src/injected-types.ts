export const INJECT_TYPES = {
  App: Symbol.for("App"),
  ILogger: Symbol.for("ILogger"),
  IUserController: Symbol.for("IUserController"),
  IUserService: Symbol.for("IUserService"),
  IExceptionFilter: Symbol.for("IExceptionFilter"),
  IUserRepository: Symbol.for("IUserRepository"),
  DatabaseService: Symbol.for("DatabaseService"),
  IConfigService: Symbol.for("IConfigService"),
};
