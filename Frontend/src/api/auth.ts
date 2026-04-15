import type { AxiosResponse } from 'axios';
import client from '../lib/axios.js';
import type { ResponseSafeUser } from 'moviesclub-shared/auth';

type CheckSessionResponse = {
    user: null | ResponseSafeUser
}

const catchAsync = async <T>(promise: Promise<AxiosResponse<T>>) => {
    try {
        const response = await promise;
        return [null, response.data] as [null, T];
    } catch (error) {
        return [error, null] as [Error, null];
    }
};

export const checkSession = async () => {
    const [error, data] = await catchAsync(client.get<CheckSessionResponse>('/auth/check'));
    if (!error) return data;
    throw error
}
