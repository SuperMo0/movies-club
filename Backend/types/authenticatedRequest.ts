import type { Request } from 'express'
import { AppError } from '../errors/appError.ts'

export function requireUserId(req: Request): string {
  if (!req.userId) {
    throw new AppError({
      statusCode: 401,
      code: 'AUTH_REQUIRED',
      message: 'Missing authenticated user id',
      publicMessage: 'Unauthorized',
    })
  }

  return req.userId
}
