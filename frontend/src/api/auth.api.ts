import client from '../lib/axios.js';
import type { SafeUserResponse, LoginType, SignupType } from 'moviesclub-shared/auth';
import { catchAsync } from '@/utils/catch-async.js';

export type SessionResponse = {
    user: null | SafeUserResponse
}

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

export const logout = async () => {
    const [error, data] = await catchAsync(client.post<SessionResponse>('/auth/logout'));
    if (error) throw error;
    return data;
}