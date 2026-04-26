import { z } from 'zod';
import * as socialSchemas from './social.schema'
import { safeUserResponseSchema } from './auth.schema';

export const getPostsResponseSchema = z.object({
  posts: z.array(socialSchemas.postSchema)
})
export type GetPostsResponse = z.infer<typeof getPostsResponseSchema>;


export const getUserLikedPostsResposneSchema = z.object({
  likedPosts: z.array(z.string()),
})
export type GetUserLikedPostsResponse = z.infer<typeof getUserLikedPostsResposneSchema>;


export const getUserProfileDataResponseSchema = z.object({
  userProfileData: safeUserResponseSchema.extend({
    posts: z.array(socialSchemas.postSchema)
  })
})
export type GetUserProfileDataResponse = z.infer<typeof getUserProfileDataResponseSchema>


export const postLikePostResponseSchmea = z.object({
  post: socialSchemas.postSchema
})
export type PostLikePostResponse = z.infer<typeof postLikePostResponseSchmea>


export const deleteLikePostResponseSchmea = z.object({
  post: socialSchemas.postSchema
})
export type DeletLikePostResponse = z.infer<typeof deleteLikePostResponseSchmea>


export const postcreateCommentOnPostResponseSchema = z.object({
  comment: socialSchemas.commentSchema
})
export type PostCreateCommentOnPostResponse = z.infer<typeof postcreateCommentOnPostResponseSchema>


export const postCreatePostResponseSchema = z.object({
  post: socialSchemas.postSchema
})
export type PostCreatePostResponse = z.infer<typeof postCreatePostResponseSchema>


export const putUpdateProfileResponseSchema = z.object({
  user: safeUserResponseSchema
})
export type PutUpdateProfileResponse = z.infer<typeof putUpdateProfileResponseSchema>


export const getUserFollowsListResponseSchema = z.object({
  userFollowsList: z.array(z.string())
})
export type GetUserFollowsListResponse = z.infer<typeof getUserFollowsListResponseSchema>


export const deleteUnfollowUserResponseSchema = z.object({
  userFollowsList: z.array(z.string())
})
export type DeleteUnfollowUserResponse = z.infer<typeof deleteUnfollowUserResponseSchema>


export const postFollowUserResponseSchema = z.object({
  userFollowsList: z.array(z.string())
})
export type PostFollowUserResponse = z.infer<typeof postFollowUserResponseSchema>


export const getSignUploadSignutureResponseSchema = z.object({
  signature: z.string(),
  timestamp: z.number(),
  cloudname: z.string(),
  apikey: z.string()
})
export type GetSignUploadSignutureResponse = z.infer<typeof getSignUploadSignutureResponseSchema>





