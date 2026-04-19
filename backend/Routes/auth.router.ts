import { Router } from 'express'
import * as controller from '../controllers/auth.controller.ts'

const router = Router()

router.post('/login', controller.login)
router.post('/signup', controller.signup)
router.post('/logout', controller.logout)
router.get('/check', controller.check)

export default router
