import type { RequestHandler } from 'express'
import { verify } from '../lib/jwt.ts'
import { AppError } from '../errors/appError.ts'

const protect: RequestHandler = async (req, res, next) => {
  try {
    const { jwt } = req.cookies as { jwt?: string }
    const userId = await verify(jwt)
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
