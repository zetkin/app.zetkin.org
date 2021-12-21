import { QueryState } from 'react-query/types/core/query';
import { useMutation, UseMutationOptions, UseMutationResult, useQuery, UseQueryResult } from 'react-query';

import { defaultFetch } from 'fetching';
import handleResponse from './handleResponse';
import { ScaffoldedContext } from 'utils/next';

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
    mutationOptions?: Omit<UseMutationOptions<Result, unknown, Input, unknown>, 'mutationFn'>,
): () => UseMutationResult<Result, unknown, Input, unknown> => {

    const method = fetchOptions?.method || 'POST';

    const handler = async (reqBody: Input): Promise<Result> => {
        const res = await defaultFetch(url, {
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json',
            },
            ...fetchOptions,
            method,
        });
        return handleResponse(res, method);
    };

    return () => useMutation(handler, mutationOptions);
};

/**
 * Returns an async function which takes the context as an argument, runs the prefetch, and returns the query state
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