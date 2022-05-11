import APIError from 'utils/apiError';
import { defaultFetch } from 'fetching';
import handleResponseData from './handleResponseData';

export const createPutOrDeleteHandler =
  (method: RequestInit['method']) =>
  (url: string, fetchOptions?: RequestInit) =>
  async (id?: number): Promise<null> => {
    const res = await defaultFetch(`${url}/${id ? id : ''}`, {
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

export const createPatchHandler =
  <Input extends { id: number }, Result>(url: string) =>
  async (resource: Input): Promise<Result> => {
    const { id, ...resourceWithoutId } = resource;
    const res = await defaultFetch(`${url}/${id}`, {
      body: JSON.stringify(resourceWithoutId),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    });
    return handleResponseData<Result>(res, 'PATCH');
  };
