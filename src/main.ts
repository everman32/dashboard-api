import { App } from "./app";
import { TYPES } from "./di/types";
import { container } from "./di/inversify-config";

export const bootstrap = async (): Promise<App> => {
  const app = container.get<App>(TYPES.App);
  await app.init();

  return app;
};

bootstrap();
