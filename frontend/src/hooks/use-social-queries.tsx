import { fetchAppPosts, fetchAppUsers, fetchUserLikedPosts, GETProfileData, GETUserFollows } from "@/api/social.api";
import { useQuery } from "@tanstack/react-query"
import { useSession } from "./use-auth-queries";
import type { AxiosError } from "axios";



export function usePosts() {

    return useQuery({
        queryKey: ["posts"],
        queryFn: fetchAppPosts,
        staleTime: 60 * 15,
        throwOnError: true,
    });
}

export function useUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: fetchAppUsers,
        staleTime: 60 * 15,
        throwOnError: true,
    });

}

export function useUserLikedPosts() {

    const { data: session } = useSession();
    const authUser = session?.user;

    return useQuery({
        queryKey: ["userLikedPosts"],
        queryFn: fetchUserLikedPosts,
        staleTime: 60 * 15,
        enabled: authUser != null,
        throwOnError: true
    });

}

export function useProfileData(username: string) {
    return useQuery({
        queryKey: ["profile", username],
        queryFn: GETProfileData
    })

}

export function useUserFollow() {
    return useQuery({
        queryKey: ["follows"],
        queryFn: GETUserFollows,
        retry: (c, e: AxiosError) => e.status != 401
    })

}


