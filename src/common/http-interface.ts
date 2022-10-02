import { Request, Response, NextFunction } from "express";

export interface IHttp {
  execute: (req: Request, res: Response, next: NextFunction) => void;
}
