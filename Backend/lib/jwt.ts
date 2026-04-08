import jwt, { type JwtPayload, type Secret, type SignCallback, type VerifyErrors } from 'jsonwebtoken'
import type { Response } from 'express'

export type AuthJwtPayload = JwtPayload & { id: string }

const SECRET: Secret = process.env.SECRET ?? ''

export async function sign(user: { id: string }, res: Response): Promise<string> {
  return new Promise((resolve, reject) => {
    const callback: SignCallback = (error, token) => {
      if (error || !token) {
        reject(error ?? new Error('Token creation failed'))
        return
      }

      res.cookie('jwt', token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
      resolve(token)
    }

    jwt.sign({ id: user.id }, SECRET, { expiresIn: '30 days' }, callback)
  })
}

export async function verify(token: string | undefined): Promise<string> {
  if (!token) {
    throw new Error('No token provided')
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (error: VerifyErrors | null, decodedToken?: string | JwtPayload) => {
      if (error) {
        reject(error)
        return
      }

      if (!decodedToken || typeof decodedToken === 'string' || typeof (decodedToken as AuthJwtPayload).id !== 'string') {
        reject(new Error('Invalid token payload'))
        return
      }

      resolve((decodedToken as AuthJwtPayload).id)
    })
  })
}
