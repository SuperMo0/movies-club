import { Router } from 'express'
import * as controller from '../controllers/social.controller.ts'
import protect from '../middlewares/protect.ts'
import multer from 'multer'

const router = Router()

router.get('/feed', controller.getFeed)
router.get('/users', controller.getUsers)
router.get('/users/:username', controller.getUserPosts)

router.use(protect)

router.get('/liked', controller.getUserLikedPosts)
router.get('/follows', controller.getUserFollows)
router.post('/like/:postId', controller.likePost)
router.post('/follow/:userId', controller.followUser)
router.post('/comment/:postId', controller.commentPost)
router.post('/post', multer().single('image'), controller.createPost)


router.put('/profile', multer().single('image'), controller.updateProfile)

router.delete('/like/:postId', controller.deleteLikePost)
router.delete('/follow/:userId', controller.deleteFollowUser)

export default router
