import { catchAsync } from "@/utils/catch-async";
import client from "@/lib/axios"
import type { SafeUserResponse } from "moviesclub-shared/auth";
import { type Post, type CreatePostBodyServer, type CreateCommentBody, type UpdateProfileBodyServer, type CreatePostBodyClient, type UpdateProfileBodyClient, type UserProfileData } from 'moviesclub-shared/social'
import { compressImage } from "@/utils/compress-image";
import { type QueryFunctionContext } from "@tanstack/query-core"
import type { DeleteUnfollowUserResponse, DeletLikePostResponse, GetPostsResponse, GetSignUploadSignutureResponse, GetUserFollowsListResponse, GetUserLikedPostsResponse, GetUserProfileDataResponse, PostCreateCommentOnPostResponse, PostCreatePostResponse, PostFollowUserResponse, PostLikePostResponse, PutUpdateProfileResponse } from 'moviesclub-shared/api'

export type ServerMessage = {
    message: string
}

export async function SignAndUploadCloudinary(data: File) {
    const signData = await GETSignUpload();
    const formData = createCloudinaryFormData(signData, data);
    const secureURL = await POSTCloudinary(signData, formData);
    return secureURL;
}


export async function GETUserLikedPosts() {
    const [error, data] = await catchAsync(client.get<GetUserLikedPostsResponse>('/social/liked'));
    if (error) throw error;
    return data;
}


export async function GETPosts() {
    const [error, data] = await catchAsync(client.get<GetPostsResponse>('/social/feed'));
    if (error) throw error;
    return data;
}


export async function GETProfileData(c: QueryFunctionContext) {
    const [_, username] = c.queryKey;
    const [error, data] = await catchAsync(client.get<GetUserProfileDataResponse>(`/social/users/${username}`));
    if (error) throw error;
    return data;
}

export async function POSTLikePost(post: Post) {
    const [error, data] = await catchAsync(client.post<PostLikePostResponse>(`/social/like/${post.id}`));
    if (error) throw error;
    return data;
}

export async function DELETELikePost(post: Post) {
    const [error, data] = await catchAsync(client.delete<DeletLikePostResponse>(`/social/like/${post.id}`));
    if (error) throw error;
    return data;
}


export async function POSTCreateCommentOnPost(variables: { comment: CreateCommentBody, post: Post },) {
    const [error, data] = await catchAsync(client.post<PostCreateCommentOnPostResponse>(`social/comment/${variables.post.id}`, variables.comment));
    if (error) throw error;
    return data;
}


export async function POSTCreatePost(post: CreatePostBodyServer) {
    const [error, data] = await catchAsync(client.postForm<PostCreatePostResponse>('/social/post', post));
    if (error) throw error;
    return data;
}

export async function PUTUserProfile(UpdatedProfileData: UpdateProfileBodyServer) {
    const [error, data] = await catchAsync(client.putForm<PutUpdateProfileResponse>('/social/profile', UpdatedProfileData));
    if (error) throw error;
    return data;
}


export async function POSTFollowUser(targetId: string) {
    const [error, data] = await catchAsync(client.post<PostFollowUserResponse>(`/social/follow/${targetId}`));
    if (error) throw error;
    return data;
}

export async function DELETEFollowUser(targetId: string) {
    const [error, data] = await catchAsync(client.delete<DeleteUnfollowUserResponse>(`/social/follow/${targetId}`));
    if (error) throw error;
    return data;
}


export async function GETUserFollowsList() {
    const [error, data] = await catchAsync(client.get<GetUserFollowsListResponse>('/social/follows/'));
    if (error) throw error;
    return data;
}

export async function GETSignUpload() {
    const [error, data] = await catchAsync(client.get<GetSignUploadSignutureResponse>('/signupload'));
    if (error) throw error
    return data
}

export async function POSTCloudinary(signData: GetSignUploadSignutureResponse, formData: FormData): Promise<string> {
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
    return await POSTCreatePost(newFormData);
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


export function createCloudinaryFormData(signData: GetSignUploadSignutureResponse, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signData.apikey);
    formData.append("timestamp", signData.timestamp.toString());
    formData.append("signature", signData.signature);
    formData.append("folder", "signed_upload_demo");
    return formData;
}