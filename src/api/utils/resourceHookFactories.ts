import nProgress from 'nprogress';
import { QueryState } from 'react-query/types/core/query';
import { QueryClient, useMutation, UseMutationOptions, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from 'react-query';

import APIError from 'utils/apiError';
import { defaultFetch } from 'fetching';
import handleResponse from './handleResponse';
import { ScaffoldedContext } from 'utils/next';


const makeUseMutationOptions = <Input, Result>(
    queryClient: QueryClient,
    key: string[],
    mutationOptions?: UseMutationOptions<Result, unknown, Input, unknown>,
) => {
    return {
        onMutate: () => nProgress.start(),
        onSettled: async () => nProgress.done(),
        onSuccess: async () => queryClient.invalidateQueries(key),
        ...mutationOptions,
    };
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

export const createUseMutation = <Input, Result>(
    key: string[],
    url: string,
    fetchOptions?: RequestInit,
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

    return () => {
        const queryClient = useQueryClient();
        return useMutation(handler, makeUseMutationOptions(queryClient, key, mutationOptions));
    };
};


export const createUseMutationDelete = (
    key: string[],
    url: string,
    fetchOptions?: RequestInit,
    mutationOptions?: Omit<UseMutationOptions<null, unknown, void, unknown>, 'mutationFn'>,
): () => UseMutationResult<null, unknown, void, unknown> => {
    const handler = async (): Promise<null> => {
        const res = await defaultFetch(url, {
            method: 'DELETE',
            ...fetchOptions,

        });
        if (!res.ok) {
            throw new APIError('DELETE', res.url);
        }
        return null;
    };

    return () => {
        const queryClient = useQueryClient();
        return useMutation(handler, makeUseMutationOptions(queryClient, key, mutationOptions));
    };
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