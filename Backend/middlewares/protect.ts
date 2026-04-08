import type { RequestHandler } from 'express'
import { verify } from '../lib/jwt.ts'
import { AppError } from '../errors/appError.ts'

const protect: RequestHandler = async (req, res, next) => {
  try {
    const token = (req.cookies as { jwt?: string } | undefined)?.jwt
    const userId = await verify(token)
    req.userId = userId
    return next()
  } catch {
    throw new AppError({
      statusCode: 401,
      code: 'AUTH_REQUIRED',
      message: 'Unauthorized',
    })
  }
}

export default protect
