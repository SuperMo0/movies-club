import type { NextFunction, Request, Response } from 'express'
import { appError } from './appError.ts'
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof appError) {
    return res.status(err.status).json({ message: err.message });
  }
  console.error(err);
  res.status(500).end();
}
