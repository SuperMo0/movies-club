import { ZodError } from 'zod'
import { AppError } from './appError.ts'

type PrismaKnownRequestError = {
  name: string
  code: string
  meta?: { target?: string[] | string }
  message: string
}

function isPrismaKnownRequestError(error: unknown): error is PrismaKnownRequestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'PrismaClientKnownRequestError' &&
    'code' in error &&
    typeof error.code === 'string'
  )
}

function mapPrismaKnownRequestError(error: PrismaKnownRequestError): AppError {
  switch (error.code) {
    case 'P2002':
      return new AppError({
        statusCode: 409,
        code: 'UNIQUE_CONSTRAINT',
        message: error.message,
        publicMessage: 'Resource already exists',
        details: error.meta?.target ? { target: error.meta.target } : undefined,
      })
    case 'P2025':
      return new AppError({
        statusCode: 404,
        code: 'RECORD_NOT_FOUND',
        message: error.message,
        publicMessage: 'Resource not found',
      })
    default:
      return new AppError({
        statusCode: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
        publicMessage: 'Internal Server Error',
      })
  }
}

function mapZodError(error: ZodError): AppError {
  return new AppError({
    statusCode: 400,
    code: 'VALIDATION_ERROR',
    message: error.message,
    publicMessage: 'Validation failed',
    details: error.issues.map(issue => ({
      code: issue.code,
      path: issue.path.join('.'),
      message: issue.message,
    })),
  })
}

export function mapError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof ZodError) {
    return mapZodError(error)
  }

  if (isPrismaKnownRequestError(error)) {
    return mapPrismaKnownRequestError(error)
  }

  return new AppError({
    statusCode: 500,
    code: 'INTERNAL_SERVER_ERROR',
    message: error instanceof Error ? error.message : 'Unexpected error',
    publicMessage: 'Internal Server Error',
  })
}
