import APIError from 'utils/apiError';
import { defaultFetch } from 'fetching';

export const createDeleteHandler = (
    url: string,
    fetchOptions?: RequestInit,
) => async (): Promise<null> => {
    const res = await defaultFetch(url, {
        method: 'DELETE',
        ...fetchOptions,

    });
    if (!res.ok) {
        throw new APIError('DELETE', res.url);
    }
    return null;
};
