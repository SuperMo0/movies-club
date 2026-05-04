import type { RequestHandler } from 'express'
import { verifyToken } from '../lib/jwt.ts'

export const protect: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const payload = await verifyToken(token);
    res.locals.userId = payload.userId;
    return next()
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
}

export default protect
