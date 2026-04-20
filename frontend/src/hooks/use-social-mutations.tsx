import { DELETELikePost, handleNewPostMutation, POSTComment, POSTLikePost } from '@/api/social'
import { useMutation, useQueryClient } from '@tanstack/react-query'


export function usePOSTLikePost() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: POSTLikePost,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['userLikedPosts'] }) }
    })
}

export function useDELETELikePost() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: DELETELikePost,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['userLikedPosts'] }) }
    })
}

export function usePOSTComment() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: POSTComment,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['posts'] }) }
    })
}


export function usePOSTPost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: handleNewPostMutation,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['posts'] }) },
    })
}