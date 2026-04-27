import { Router } from 'express'
import * as controller from '../controllers/movies.controller.ts'

const router = Router()

router.get('/', controller.getTodayMovies);
router.get('/cinemas', controller.getCinemas);

export default router
