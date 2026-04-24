import { catchAsync } from "@/utils/catch-async";
import client from "@/lib/axios"
import type { ResponseSafeUser } from "moviesclub-shared/auth";
import { type Comment, type Post, type CreatePostBodyServer, type CreateCommentBody, type UpdateProfileBodyServer, type CreatePostBodyClient, type UpdateProfileBodyClient, type UserProfileData } from 'moviesclub-shared/social'
import { compressImage } from "@/utils/compress-image";
import { type QueryFunctionContext } from "@tanstack/query-core"
import type { SessionResponse } from "./auth.api";

export type ServerMessage = {
    message: string
}

export async function SignAndUploadCloudinary(data: File) {
    let signError, signData;
    [signError, signData] = await GETSignUpload();
    if (signError) throw signError;
    const formData = createCloudinaryFormData(signData, data);
    const secureURL = await POSTCloudinary(signData, formData);
    return secureURL;
}

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

type GETProfileDataResponse = {
    userProfileData: UserProfileData
}
export async function GETProfileData(c: QueryFunctionContext) {
    const [_, username] = c.queryKey;
    const [error, data] = await catchAsync(client.get<GETProfileDataResponse>(`/social/users/${username}`));
    if (error) throw error;
    return data.userProfileData;
}

type POSTLikePostResponse = ServerMessage;
export async function POSTLikePost(post: Omit<Post, "author">) {
    const [error, data] = await catchAsync(client.post<POSTLikePostResponse>(`/social/like/${post.id}`));
    if (error) throw error;
    return data;
}

type DELETELikePostResponse = ServerMessage;
export async function DELETELikePost(post: Omit<Post, "author">) {
    const [error, data] = await catchAsync(client.delete<DELETELikePostResponse>(`/social/like/${post.id}`));
    if (error) throw error;
    return data;
}

type POSTCommentResponse = {
    comment: Comment
};
export async function POSTComment(variables: { comment: CreateCommentBody, post: Omit<Post, "author"> },) {
    const [error, data] = await catchAsync(client.post<POSTCommentResponse>(`social/comment/${variables.post.id}`, variables.comment));
    if (error) throw error;
    return data;
}

export type POSTPostResponse = {
    post: Post
};
export async function POSTPost(post: CreatePostBodyServer) {
    const [error, data] = await catchAsync(client.postForm<POSTPostResponse>('/social/post', post));
    if (error) throw error;
    return data;
}

export async function PUTUserProfile(UpdatedProfileData: UpdateProfileBodyServer) {
    const [error, data] = await catchAsync(client.putForm<SessionResponse>('/social/profile', UpdatedProfileData));
    if (error) throw error;
    return data;
}

export type POSTFollowResponse = {
    user: ResponseSafeUser
}
export async function POSTFollowUser(targetId: string) {
    const [error, data] = await catchAsync(client.post<POSTFollowResponse>(`/social/follow/${targetId}`));
    if (error) throw error;
    return data;
}

export async function DELETEFollowUser(targetId: string) {
    const [error, data] = await catchAsync(client.delete<POSTFollowResponse>(`/social/follow/${targetId}`));
    if (error) throw error;
    return data;
}

export type GETUserFollowsListResponse = { userFollowsList: string[] };
export async function GETUserFollowsList() {
    const [error, data] = await catchAsync(client.get<GETUserFollowsListResponse>('/social/follows/'));
    if (error) throw error;
    return data.userFollowsList;
}

export async function GETSignUpload() {
    return await catchAsync(client.get('/signupload'));
}

export async function POSTCloudinary(signData: any, formData: FormData): Promise<string> {

    const url = "https://api.cloudinary.com/v1_1/" + signData.cloudname + "/image/upload";

    const [error, data] = await catchAsync(client.post(url, formData, { withCredentials: false }));

    if (error) throw error

    return data.secure_url as string;
}

export async function orchesteratePostCreation(formData: CreatePostBodyClient) {

    let newFormData: CreatePostBodyServer;
    let secureURL: string | undefined;
    if (formData.image) {
        formData.image = await compressImage(formData.image);
        secureURL = await SignAndUploadCloudinary(formData.image);
    }

    newFormData = { ...formData, image: secureURL };

    return await POSTPost(newFormData);
}

export async function orchesterateProfileUpadate(formData: UpdateProfileBodyClient) {

    let newFormData: UpdateProfileBodyServer;
    let secureURL: string | undefined;
    if (formData.image) {
        formData.image = await compressImage(formData.image);
        secureURL = await SignAndUploadCloudinary(formData.image);
    }

    newFormData = { ...formData, image: secureURL };

    return await PUTUserProfile(newFormData);
}


export function createCloudinaryFormData(signData: any, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signData.apikey);
    formData.append("timestamp", signData.timestamp);
    formData.append("signature", signData.signature);
    formData.append("folder", "signed_upload_demo");
    return formData;
}