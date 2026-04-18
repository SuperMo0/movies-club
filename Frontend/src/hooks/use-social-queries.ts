import { fetchAppPosts, fetchAppUsers, fetchUserLikedPosts } from "@/api/social";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useSession } from "./use-auth-queries";



export function usePosts() {

    return useSuspenseQuery({
        queryKey: ["posts"],
        queryFn: fetchAppPosts,
        staleTime: 60 * 15,
    });
}

export function useUsers() {
    return useSuspenseQuery({
        queryKey: ["users"],
        queryFn: fetchAppUsers,
        staleTime: 60 * 15,
    });

}

export function useUserLikedPosts() {

    const { data: session } = useSession();
    const authUser = session?.user;

    return useQuery({
        queryKey: ["user", 'liked'],
        queryFn: fetchUserLikedPosts,
        staleTime: 60 * 15,
        enabled: authUser != null
    });

}


