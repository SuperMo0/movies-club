import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from '@/api/auth';

export function useLoginMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => { queryClient.setQueryData(['session'], data) },
    });
}