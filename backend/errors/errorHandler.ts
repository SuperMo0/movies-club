import type { NextFunction, Request, Response } from 'express'
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  console.log(err);
  return res.status(500).json({ message: "Internal Server Error" });
}
