import { Router } from 'express'
import * as controller from '../controllers/social.controller.ts'
import protect from '../middlewares/protect.ts'
import { validateBody } from '../middlewares/validateBody.ts'
import { validateParams } from '../middlewares/validateParams.ts'
import { paramsWithpostIdSceham, paramsWithUserIdSceham, paramsWithUsernameSchema } from '../types/express/express.types.ts'


const router = Router()




router.get('/feed', controller.getFeed)
router.get('/users/:username', validateParams(paramsWithUsernameSchema), controller.getUserPosts)

router.use(protect)

router.get('/liked', controller.getUserLikedPosts)
router.get('/follows', controller.getUserFollows)

router.post('/like/:postId', validateParams(paramsWithpostIdSceham), controller.likePost)
router.post('/follow/:userId', validateParams(paramsWithUserIdSceham), controller.followUser)
router.post('/comment/:postId', validateParams(paramsWithpostIdSceham), controller.commentPost)
router.post('/post', controller.createPost)


router.put('/profile', controller.updateProfile)
router.delete('/like/:postId', validateParams(paramsWithpostIdSceham), controller.unlikePost)
router.delete('/follow/:userId', validateParams(paramsWithUserIdSceham), controller.deleteFollowUser)

export default router
