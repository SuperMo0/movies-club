import { Router } from 'express'
import * as controller from '../controllers/movies.controller.ts'

const router = Router()

router.get('/today', controller.getTodayMovies)

export default router
