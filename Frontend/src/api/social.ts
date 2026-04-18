import { catchAsync } from "@/utils/catch-async";
import client from "@/lib/axios"
import type { ResponseSafeUser } from "moviesclub-shared/auth";
import type { Comment, createCommentBody, createPostBody, Post } from 'moviesclub-shared/social'


type FetchAppUsersResponse = {
    users: ResponseSafeUser[]
}
export async function fetchAppUsers() {
    const [error, data] = await catchAsync(client.get<FetchAppUsersResponse>('/social/users'));
    if (error) throw error;
    return data.users;
}

type FetchUserLikedPostsResponse = {
    likedPosts: string[]
}
export async function fetchUserLikedPosts() {
    const [error, data] = await catchAsync(client.get<FetchUserLikedPostsResponse>('/social/liked'));
    if (error) throw error;
    return data.likedPosts;
}

type FetchAppPostsResponse = {
    posts: Post[]
}
export async function fetchAppPosts() {
    const [error, data] = await catchAsync(client.get<FetchAppPostsResponse>('/social/feed'));
    if (error) throw error;
    return data.posts;
}
export type ServerMessage = {
    message: string
}

type POSTLikePostResponse = ServerMessage;
export async function POSTLikePost(postId: string) {
    const [error, data] = await catchAsync(client.post<POSTLikePostResponse>(`/social/like/${postId}`));
    if (error) throw error;
    return data;
}

type DELETELikePostResponse = ServerMessage;
export async function DELETELikePost(postId: string) {
    const [error, data] = await catchAsync(client.delete<DELETELikePostResponse>(`/social/like/${postId}`));
    if (error) throw error;
    return data;
}

type POSTCommentResponse = {
    comment: Comment
};
export async function POSTComment(variables: { comment: createCommentBody, postId: string },) {
    const [error, data] = await catchAsync(client.post<POSTCommentResponse>(`social/comment/${variables.postId}`, variables.comment));
    if (error) throw error;
    return data;
}


type POSTPostResponse = {
    post: Post
};
export async function POSTPost(post: createPostBody) {
    const [error, data] = await catchAsync(client.post<POSTPostResponse>('/social/post', post));
    if (error) throw error;
    return data;
}