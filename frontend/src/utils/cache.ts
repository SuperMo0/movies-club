import type { SessionResponse } from '@/api/auth.api';
import { queryClient } from '@/main'
import type { GetPostsResponse, GetUserFollowsListResponse, GetUserLikedPostsResponse, GetUserProfileDataResponse } from 'moviesclub-shared/api'



export function getUserLikedPostsCache() {
    const data = queryClient.getQueryData<GetUserLikedPostsResponse>(["userLikedPosts"]);
    return data;
}

export function setUserLikedPostsCache(updater: (data: GetUserLikedPostsResponse | undefined) => GetUserLikedPostsResponse | undefined) {
    const data = queryClient.setQueryData<GetUserLikedPostsResponse>(["userLikedPosts"], updater);
    return data;
}


export function getPostsCache() {
    const data = queryClient.getQueryData<GetPostsResponse>(["posts"]);
    return data;
}

export function setPostsCache(updater: (data: GetPostsResponse | undefined) => GetPostsResponse | undefined) {
    const data = queryClient.setQueryData<GetPostsResponse>(["posts"], updater);
    return data;
}


export function getUserProfileDataCache(username: string) {
    const data = queryClient.getQueryData<GetUserProfileDataResponse>(["profile", username]);
    return data;
}

export function setUserProfileDataCache(updater: (data: GetUserProfileDataResponse | undefined) => GetUserProfileDataResponse | undefined, username: string) {
    const data = queryClient.setQueryData<GetUserProfileDataResponse>(["profile", username], updater);
    return data;
}


export function getSessionCache() {
    const data = queryClient.getQueryData<SessionResponse>(["session"]);
    return data;
}

export function setSessionCache(updater: (data: SessionResponse | undefined) => SessionResponse | undefined) {
    const data = queryClient.setQueryData<SessionResponse>(["session"], updater);
    return data;
}


export function getUserFollowsListCache() {
    const data = queryClient.getQueryData<GetUserFollowsListResponse>(["follows"]);
    return data;
}

export function setUserFollowsListCache(updater: (data: GetUserFollowsListResponse | undefined) => GetUserFollowsListResponse | undefined) {
    const data = queryClient.setQueryData<GetUserFollowsListResponse>(["follows"], updater);
    return data;
}


