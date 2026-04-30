import client from '../lib/axios.js';
import type { LoginBody, SignupBody, SessionResponse } from 'moviesclub-shared/auth';
import { catchAsync } from '@/utils/catch-async.js';



export const checkSession = async () => {
    const [error, data] = await catchAsync(client.get<SessionResponse>('/auth/check'));
    if (error?.status == 401) return { user: null };
    else if (error) throw error;
    return data;
}

export const login = async (loginFromData: LoginBody) => {
    const [error, data] = await catchAsync(client.post<SessionResponse>('/auth/login', loginFromData))
    if (error) throw error;
    return data;
}

export const signup = async (signupFormData: SignupBody) => {
    const [error, data] = await catchAsync(client.post<SessionResponse>('/auth/signup', signupFormData));
    if (error) throw error;
    return data;
}

export const logout = async () => {
    const [error, data] = await catchAsync(client.post<SessionResponse>('/auth/logout'));
    if (error) throw error;
    return data;
}