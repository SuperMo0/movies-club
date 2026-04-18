import { catchAsync } from "@/utils/catch-async";
import client from "@/lib/axios"
import type { ResponseSafeUser } from "moviesclub-shared/auth";
import type { Post } from 'moviesclub-shared/social'


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



