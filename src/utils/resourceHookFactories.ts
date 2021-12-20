/* eslint-disable react-hooks/rules-of-hooks */
import { QueryState } from 'react-query/types/core/query';
import { useMutation, UseMutationResult, useQuery, UseQueryResult } from 'react-query';


import APIError from './apiError';
import { defaultFetch } from 'fetching';
import { ScaffoldedContext } from './next';

interface ZetkinApiResponse<G> {
    data?: G;
    error?: unknown;
}

const handleResponse = async <Result>(res: Response, method: string) => {
    if (!res.ok) {
        try {
            // Try to get the body and throw error with it
            const body = await res.json() as ZetkinApiResponse<Result>;
            throw new APIError(method, res.url, body);
        }
        catch (e) {
            if (e instanceof APIError) {
                throw e;
            }
            else {
                throw new APIError(method, res.url);
            }
        }
    }

    const body = await res.json() as ZetkinApiResponse<Result>;

    if (!body.data) {
        throw new APIError(method, res.url);
    }

    return body.data;

};


export const createUseQuery = <Result>(
    key: string[],
    url: string,
    fetchOptions?: RequestInit,
): () => UseQueryResult<Result> => {

    const handler = async () => {
        const res = await defaultFetch(url, fetchOptions);
        return handleResponse(res, fetchOptions?.method || 'GET');
    };


    return () => {
        return useQuery(
            key,
            handler,
        );
    };

};

export const createMutation = <Input, Result>(
    key: string[],
    url: string,
    fetchOptions: RequestInit,
): () => UseMutationResult<Result, unknown, Input, unknown> => {

    const method = fetchOptions?.method || 'post';

    async function handler (reqBody: Input): Promise<Result> {
        const res = await defaultFetch(url, {
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json',
            },
            ...fetchOptions,
            method,
        });
        return handleResponse(res, method);
    }

    return () => useMutation(handler);
};

/**
 * Returns an async function which takes the context, runs the prefetch, and returns the query state
 */
export const createPrefetch = <Result>(
    key: string[],
    url: string,
    fetchOptions?: RequestInit,
): (scaffoldContext: ScaffoldedContext) => Promise<QueryState<Result> | undefined> => {

    return async (
        scaffoldContext,
    ) => {
        // Build get handler
        const handler = async (): Promise<Result> => {
            const res = await scaffoldContext.apiFetch(url, fetchOptions);
            return handleResponse(res, fetchOptions?.method || 'get');
        };

        await scaffoldContext.queryClient.prefetchQuery(
            key,
            handler,
        );

        return scaffoldContext.queryClient.getQueryState(key);
    };

};