import { catchAsync } from "@/utils/catch-async";
import client from "@/lib/axios"
import type { ResponseSafeUser } from "moviesclub-shared/auth";
import { type Comment, type Post, type CreatePostBodyServer, type CreatePostBodyClient, type CreateCommentBody, type UpdateProfileBodyServer } from 'moviesclub-shared/social'
import imageCompression from 'browser-image-compression';
import type { MutationFunction } from '@tanstack/react-query'



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
export async function POSTComment(variables: { comment: CreateCommentBody, postId: string },) {
    const [error, data] = await catchAsync(client.post<POSTCommentResponse>(`social/comment/${variables.postId}`, variables.comment));
    if (error) throw error;
    return data;
}


type POSTPostResponse = {
    post: Post
};

export function handleFormDataImage<T, B>(callBack: (x: T) => Promise<B>) {
    return async (data: T & { image?: File | null | undefined }) => {
        let signError, signData, secureURL;
        if (data.image) {
            [signError, signData] = await GETSignUpload();
            if (signError) throw signError;
            const formData = createCloudinaryFormData(signData, data);
            secureURL = await POSTCloudinary(signData, formData);
        }
        let newData: T = { ...data, image: secureURL }
        return callBack(newData);
    }
}

export async function POSTPost(post: CreatePostBodyServer) {
    const [error, data] = await catchAsync(client.postForm<POSTPostResponse>('/social/post', post));
    if (error) throw error;
    return data;
}


export async function PUTUserProfile(UpdatedProfileData: UpdateProfileBodyServer) {
    const [error, data] = await catchAsync(client.postForm<ResponseSafeUser>('/social/post', UpdatedProfileData));
    if (error) throw error;
    return data;
}



export async function GETSignUpload() {
    return await catchAsync(client.get('/signupload'));
}

export function createCloudinaryFormData(signData: any, data: { image?: File | null | undefined }) {

    const formData = new FormData();
    formData.append("file", data.image!);
    formData.append("api_key", signData.apikey);
    formData.append("timestamp", signData.timestamp);
    formData.append("signature", signData.signature);
    formData.append("folder", "signed_upload_demo");
    return formData;
}

export async function POSTCloudinary(signData: any, formData: FormData): Promise<string> {

    const url = "https://api.cloudinary.com/v1_1/" + signData.cloudname + "/image/upload";

    const [error, data] = await catchAsync(client.post(url, formData, { withCredentials: false }));

    if (error) throw error

    return data.secure_url as string;
}