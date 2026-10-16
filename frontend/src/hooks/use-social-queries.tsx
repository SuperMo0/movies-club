import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { useSession } from "./use-auth-queries";
import {
    GETPosts,
    GETProfileData,
    GETTrending,
    GETUserFollowsList,
    GETUserLikedPosts
} from "@/api/social.api";



export function usePosts() {
    const query = useInfiniteQuery({
        queryKey: ["posts"],
        queryFn: GETPosts,
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        staleTime: 60 * 15,
        // Only a failed first page is fatal; a failed later page keeps the feed and shows a retry button.
        throwOnError: (_, query) => !query.state.data,
        select: (d) => d.pages.flatMap(page => page.posts)
    });
    return query
}

export function useTrending() {
    return useQuery({
        queryKey: ["trending"],
        queryFn: GETTrending,
        staleTime: 5 * 60 * 1000,
    });
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


