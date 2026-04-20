import { AxiosError, type AxiosResponse } from "axios";


// type x<T> = Promise<[null, T]> | Promise<[AxiosError<{ message: string }>, null]>;

export const catchAsync = async <T>(promise: Promise<AxiosResponse<T>>) => {
    try {
        const response = await promise;
        return [null, response.data] as const
    } catch (error) {
        if (error instanceof AxiosError) return [error, null] as const;
        else return [error, null] as [Error, null];
    }
};
