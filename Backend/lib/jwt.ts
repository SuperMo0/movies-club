import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import type { Response } from 'express'

export type AuthJwtPayload = JWTPayload & { id: string }

function getRequiredSecret(): string {
  const secret = process.env.SECRET

  if (typeof secret !== 'string' || secret.trim() === '') {
    throw new Error('Missing required backend environment variables: SECRET')
  }

  return secret
}

function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(getRequiredSecret())
}

export async function sign(user: { id: string }, res: Response): Promise<string> {
  const secretKey = getSecretKey()
  const token = await new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secretKey)

  res.cookie('jwt', token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  return token
}

export async function verify(token: string | undefined): Promise<string> {
  if (!token) {
    throw new Error('No token provided')
  }

  const secretKey = getSecretKey()
  const { payload } = await jwtVerify(token, secretKey)

  if (typeof (payload as AuthJwtPayload).id !== 'string') {
    throw new Error('Invalid token payload')
  }

  return (payload as AuthJwtPayload).id
}
