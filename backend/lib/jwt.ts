import type { Response } from 'express';
import { SignJWT, jwtVerify } from 'jose'



const SECRET = process.env.SECRET!
const Uint8Array_Secret = new TextEncoder().encode(SECRET);
type PayloadBody = { userId: string }


export async function sign(user: { id: string }, res: Response) {
  const token = await new SignJWT({ userId: user.id }).setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt().setExpirationTime('2 days').sign(Uint8Array_Secret);
  res.cookie("jwt", token, { maxAge: 2 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: "lax" })
}

export async function verify(token: string) {
  const result = await jwtVerify<PayloadBody>(token, Uint8Array_Secret);
  return result.payload;
}