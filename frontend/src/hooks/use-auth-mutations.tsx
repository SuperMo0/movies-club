import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login, logout, signup } from '@/api/auth.api';
import { AxiosError } from 'axios';
import type { ResponseSafeUser } from 'moviesclub-shared/auth';

export function useLoginMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => { queryClient.setQueryData(['session'], data) },
    });
}


export function useSignupMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: signup,
        onSuccess: (data) => {
            queryClient.setQueryData(['session'], data);
        },
    });
}

export function useLogoutMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: (data) => {
            queryClient.setQueryData(["session"], data)
        }
    })
}

export function onMutationError(error: Error, setMessage: (m: string) => void) {
    if (error instanceof AxiosError)
        setMessage(error.response!.data.message);
    else setMessage("An unexpected error occurred");
}