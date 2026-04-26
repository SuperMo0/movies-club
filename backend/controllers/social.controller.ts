import * as socialService from '../services/social.service.ts';
import type {
    DeleteUnfollowUserResponse,
    GetPostsResponse,
    GetUserFollowsListResponse,
    GetUserLikedPostsResponse,
    GetUserProfileDataResponse,
    PostCreateCommentOnPostResponse,
    PostCreatePostResponse,
    PostFollowUserResponse,
    PostLikePostResponse,
    PutUpdateProfileResponse
} from 'moviesclub-shared/api'
import type {
    UpdateProfileBodyServer,
    CreateCommentBody,
    CreatePostBodyServer
} from 'moviesclub-shared/social'
import type { Request, Response } from 'express';



export async function getPosts(req: Request, res: Response<GetPostsResponse>) {
    const posts = await socialService.getPosts();
    return res.json({ posts });
}


export async function getUserLikedPosts(req: Request, res: Response<GetUserLikedPostsResponse>) {
    const userId = res.locals.userId;
    const likedPosts = await socialService.getUserLikedPosts(userId);
    return res.json({ likedPosts });
}


export async function getUserProfileData(req: Request<{ username: string }>, res: Response<GetUserProfileDataResponse>) {
    const username = req.params.username;
    const userProfileData = await socialService.getUserProfileData(username);
    res.json({ userProfileData });
}


export async function likePost(req: Request<{ postId: string }>, res: Response<PostLikePostResponse>) {
    const postId = req.params.postId;
    const userId = res.locals.userId;
    const post = await socialService.likePost(postId, userId);
    res.status(201).json({ post });
}


export async function unlikePost(req: Request<{ postId: string }>, res: Response) {
    let postId = req.params.postId;
    const userId = res.locals.userId;
    const post = await socialService.unlikePost(postId, userId);
    return res.status(200).json({ post });
}


type CommentPostRequest = Request<{ postId: string }, unknown, CreateCommentBody>;
export async function createCommentOnPost(req: CommentPostRequest, res: Response<PostCreateCommentOnPostResponse>) {
    let postId = req.params.postId;
    const userId = res.locals.userId;
    const comment = await socialService.commentOnPost(userId, postId, req.body);
    return res.status(201).json({ comment });
}


type CreatePostRequest = Request<unknown, unknown, CreatePostBodyServer>
export async function createPost(req: CreatePostRequest, res: Response<PostCreatePostResponse>) {
    const userId = res.locals.userId;
    const post = await socialService.createPost(userId, req.body);
    return res.status(201).json({ post });
}


type updateProfileRequest = Request<{}, {}, UpdateProfileBodyServer>
export async function updateProfile(req: updateProfileRequest, res: Response<PutUpdateProfileResponse>) {
    const userId = res.locals.userId;
    const user = await socialService.updateUserProfile(userId, req.body);
    return res.json({ user });
}


type FollowUserRequest = Request<{ userId: string }>
export async function followUser(req: FollowUserRequest, res: Response<PostFollowUserResponse>) {
    const userId = res.locals.userId;
    const targetUserId = req.params.userId;
    const userFollowsList = await socialService.followUser(userId, targetUserId);
    return res.json({ userFollowsList });
}


type UnfollowUserRequest = Request<{ userId: string }>
export async function unfollowUser(req: UnfollowUserRequest, res: Response<DeleteUnfollowUserResponse>) {
    const userId = res.locals.userId;
    const targetUserId = req.params.userId;
    const userFollowsList = await socialService.unfollowUser(userId, targetUserId);
    return res.json({ userFollowsList });
}

export async function getUserFollowsList(req: Request, res: Response<GetUserFollowsListResponse>) {
    const userId = res.locals.userId;
    const userFollowsList = await socialService.getUserFollowsList(userId);
    return res.json({ userFollowsList });
}