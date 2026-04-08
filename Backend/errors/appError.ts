type AppErrorInput = {
  statusCode: number
  code: string
  message: string
  publicMessage?: string
  details?: unknown
}

export class AppError extends Error {
  readonly statusCode: number
  readonly code: string
  readonly publicMessage: string
  readonly details?: unknown

  constructor({ statusCode, code, message, publicMessage, details }: AppErrorInput) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
    this.publicMessage = publicMessage ?? message
    this.details = details
    Object.setPrototypeOf(this, AppError.prototype)
  }
}
