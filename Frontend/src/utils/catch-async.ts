import type { AxiosError, AxiosResponse } from "axios";

export const catchAsync = async <T>(promise: Promise<AxiosResponse<T>>) => {
    try {
        const response = await promise;
        return [null, response.data] as [null, T];
    } catch (error) {
        return [error, null] as [AxiosError<{ message: string }>, null];
    }
};