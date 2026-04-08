import type { NextFunction, Request, Response } from 'express'
import { AppError } from './appError.ts'

export function notFound(req: Request, res: Response, next: NextFunction) {
  next(
    new AppError({
      statusCode: 404,
      code: 'NOT_FOUND',
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      publicMessage: 'Route not found',
    }),
  )
}
