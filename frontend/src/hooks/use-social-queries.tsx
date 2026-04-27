import { useQuery } from "@tanstack/react-query"
import { useSession } from "./use-auth-queries";
import {
    GETPosts,
    GETProfileData,
    GETUserFollowsList,
    GETUserLikedPosts
} from "@/api/social.api";



export function usePosts() {
    const query = useQuery({
        queryKey: ["posts"],
        queryFn: GETPosts,
        staleTime: 60 * 15,
        throwOnError: true,
        select: (d) => d.posts
    });
    return query
}

export function useUserLikedPosts() {
    const authUser = useSession().data;
    const query = useQuery({
        queryKey: ["userLikedPosts"],
        queryFn: GETUserLikedPosts,
        staleTime: 60 * 15,
        select: (d) => d.likedPosts,
        enabled: !!authUser,
        throwOnError: true
    });
    return query;
}

export function useProfileData(username: string) {
    const query = useQuery({
        queryKey: ["profile", username],
        queryFn: GETProfileData,
        select: (d) => d.userProfileData
    })
    return query;
}

export function useUserFollow() {
    const authUser = useSession().data;
    const query = useQuery({
        queryKey: ["follows"],
        queryFn: GETUserFollowsList,
        enabled: !!authUser,
        select: (d) => d.userFollowsList
    })
    return query;
}


