import { Router } from 'express'
import * as controller from '../controllers/auth.controller.ts'
import { validateBody } from '../middlewares/validateBody.ts'
import { loginBodySchema, signupBodySchema } from 'moviesclub-shared/auth'
import protect from '../middlewares/protect.ts'

const router = Router()

router.post('/login', validateBody(loginBodySchema), controller.login)
router.post('/signup', validateBody(signupBodySchema), controller.signup)
router.post('/logout', protect, controller.logout)
router.get('/check', protect, controller.check)

export default router
