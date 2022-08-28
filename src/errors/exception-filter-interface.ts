import { Request, Response, NextFunction } from "express";

export interface IExceptionFilter {
  catch: (err: Error, req: Request, res: Response, _next: NextFunction) => void;
}
