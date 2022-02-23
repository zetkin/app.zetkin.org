import APIError from 'utils/apiError';
import { defaultFetch } from 'fetching';

export const createPutOrDeleteHandler =
  (method: RequestInit['method']) =>
  (url: string, fetchOptions?: RequestInit) =>
  async (id: number): Promise<null> => {
    const res = await defaultFetch(`${url}/${id}`, {
      method,
      ...fetchOptions,
    });
    if (!res.ok) {
      throw new APIError(method || '', res.url);
    }
    return null;
  };

export const createDeleteHandler = createPutOrDeleteHandler('DELETE');
export const createPutHandler = createPutOrDeleteHandler('PUT');
