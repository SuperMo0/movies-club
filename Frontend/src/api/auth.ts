import { AxiosError, type AxiosResponse } from 'axios';
import client from '../lib/axios.js';
import type { ResponseSafeUser, LoginType, SignupType } from 'moviesclub-shared/auth';

type SessionResponse = {
    user: null | ResponseSafeUser
}

const catchAsync = async <T>(promise: Promise<AxiosResponse<T>>) => {
    try {
        const response = await promise;
        return [null, response.data] as [null, T];
    } catch (error) {
        return [error, null] as [AxiosError<{ message: string }>, null];
    }
};

export const checkSession = async () => {
    const [error, data] = await catchAsync(client.get<SessionResponse>('/auth/check'));
    if (error) throw error
    return data;
}


export const login = async (loginFromData: LoginType) => {
    const [error, data] = await catchAsync(client.post<SessionResponse>('/auth/login', loginFromData))
    if (error) throw error;
    return data;
}

export const signup = async (signupFormData: SignupType) => {
    const [error, data] = await catchAsync(client.post<SessionResponse>('/auth/signup', signupFormData));
    if (error) throw error;
    return data;
}