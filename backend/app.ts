import express from 'express'
import type { Express, NextFunction, Request, Response } from 'express'
import authRouter from './routes/auth.router.ts'
import socialRouter from './routes/social.router.ts'
import moviesRouter from './routes/movies.router.ts'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import compression from 'compression'
import helmet from 'helmet'
import { notFound } from './errors/notFound.ts'
import { errorHandler } from './errors/errorHandler.ts'
import { signuploadform } from './utils/signupload.ts'
import protect from './middlewares/protect.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const corsOptions = cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
})

type CreateAppOptions = {
  enableNonDevelopmentMiddleware?: boolean
  configureApp?: (app: Express) => void
}

export function createApp(options: CreateAppOptions = {}) {
  const app = express()
  const enableNonDevelopmentMiddleware =
    options.enableNonDevelopmentMiddleware ?? process.env.NODE_ENV !== 'development'
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 1000,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
  })

  app.use(corsOptions)
  // app.use(helmet())
  app.use(cookieParser())
  app.use(
    compression({
      threshold: 1024,
    }),
  )
  app.use(express.json())
  app.use(limiter)
  app.use('/api/social', socialRouter)
  app.use('/api/auth', authRouter)
  app.use('/api/movies', moviesRouter)
  options.configureApp?.(app)

  app.get('/api/signupload', protect, function (req: Request, res: Response, next: NextFunction) {
    const sig = signuploadform()
    res.json({
      signature: sig.signature,
      timestamp: sig.timestamp,
      cloudname: process.env.CLOUDINARY_CLOUD_NAME,
      apikey: process.env.CLOUDINARY_API_KEY
    })
  })

  app.use('/api', notFound)



  if (enableNonDevelopmentMiddleware) {
    // todo: read some docs and articles about this so we understand it better.
    // app.use(
    //   helmet.contentSecurityPolicy({
    //     directives: {
    //       defaultSrc: ["'self'"],
    //       scriptSrc: ["'self'", "'unsafe-inline'"],
    //       styleSrc: ["'self'", "'unsafe-inline'"],
    //       imgSrc: ["'self'", 'https:'],
    //       connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:5173', 'https://api.cloudinary.com/v1_1/dclszdyzb/image/upload'],
    //     },
    //   }),
    // )

    const staticPath = path.join(__dirname, '..', '..', 'frontend', 'dist')

    app.use(express.static(staticPath))

    app.get('/{*splat}', (req: Request, res: Response) => {
      res.sendFile(path.join(staticPath, 'index.html'))
    })
  }

  app.use(errorHandler)

  return app
}
