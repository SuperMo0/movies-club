import * as controller from '../controllers/social.controller.ts'
import { Router } from 'express'
import { protect } from '../middlewares/protect.ts'
import { validateBody } from '../middlewares/validateBody.ts'
import { validateParams } from '../middlewares/validateParams.ts'
import { validateQuery } from '../middlewares/validateQuery.ts'
import {
    paramsWithpostIdSceham,
    paramsWithUserIdSceham,
    paramsWithUsernameSchema
} from '../types/express/express.types.ts'
import {
    createCommentBodySchema,
    createPostBodyServerSchema,
    getPostsQuerySchema,
    updateProfileBodyServerSchema
} from 'moviesclub-shared/social'



export const router = Router()


router.get('/posts',
    validateQuery(getPostsQuerySchema),
    controller.getPosts)


router.get('/trending',
    controller.getTrending)


router.get('/users/:username',
    validateParams(paramsWithUsernameSchema),
    controller.getUserProfileData)


router.use(protect)

router.get('/liked',
    controller.getUserLikedPosts)


router.get('/follows',
    controller.getUserFollowsList)


router.post('/like/:postId',
    validateParams(paramsWithpostIdSceham),
    controller.likePost)


router.post('/follow/:userId',
    validateParams(paramsWithUserIdSceham),
    controller.followUser)


router.post('/comment/:postId',
    validateParams(paramsWithpostIdSceham),
    validateBody(createCommentBodySchema),
    controller.createCommentOnPost)


router.post('/post',
    validateBody(createPostBodyServerSchema),
    controller.createPost)


router.put('/profile',
    validateBody(updateProfileBodyServerSchema),
    controller.updateProfile)


router.delete('/like/:postId',
    validateParams(paramsWithpostIdSceham),
    controller.unlikePost)


router.delete('/follow/:userId',
    validateParams(paramsWithUserIdSceham),
    controller.unfollowUser)

export default router
