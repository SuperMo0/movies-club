import type { NextFunction, Request, Response } from 'express'
import type { ApiErrorResponse } from '../../Shared/api.schema.ts'
import { mapError } from './mapError.ts'

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const appError = mapError(err)

  const payload: ApiErrorResponse = {
    error: {
      code: appError.code,
      message: appError.publicMessage,
      ...(appError.statusCode < 500 && appError.details !== undefined ? { details: appError.details } : {}),
    },
  }

  return res.status(appError.statusCode).json(payload)
}
