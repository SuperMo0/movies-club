import { Router, type Request, type Response, type NextFunction } from 'express'
import * as controller from '../controllers/movies.controller.ts'
import { getSecondsUntil3AM } from '../utils/cache.ts'

const router = Router()

router.use((req: Request, res: Response, next: NextFunction) => {
  res.set('Cache-Control', `public, max-age=${getSecondsUntil3AM()}`)
  next()
})

router.get('/', controller.getAllMovies)
router.get('/today', controller.getTodayMovies)

export default router
