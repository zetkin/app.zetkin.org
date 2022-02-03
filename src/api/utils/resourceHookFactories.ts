/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { QueryState } from 'react-query/types/core/query';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from 'react-query';

import { createDeleteHandler } from './createDeleteHandler';
import { defaultFetch } from 'fetching';
import handleResponseData from './handleResponseData';
import { makeUseMutationOptions } from './makeUseMutationOptions';
import { ScaffoldedContext } from 'utils/next';

export const createUseQuery = <Result>(
  key: string[],
  url: string,
  fetchOptions?: RequestInit
): (() => UseQueryResult<Result>) => {
  const handler = async () => {
    const res = await defaultFetch(url, fetchOptions);
    return handleResponseData(res, fetchOptions?.method || 'GET');
  };

  return () => {
    return useQuery(key, handler);
  };
};

export const createUseMutation = <Input, Result>(
  key: string[],
  url: string,
  fetchOptions?: RequestInit,
  mutationOptions?: Omit<
    UseMutationOptions<Result, unknown, Input, unknown>,
    'mutationFn'
  >
): (() => UseMutationResult<Result, unknown, Input, unknown>) => {
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
    return handleResponseData(res, method);
  };

  return () => {
    const queryClient = useQueryClient();
    return useMutation(
      handler,
      makeUseMutationOptions(queryClient, key, mutationOptions)
    );
  };
};

export const createUseMutationDelete = (
  key: string[],
  url: string,
  fetchOptions?: RequestInit,
  mutationOptions?: Omit<
    UseMutationOptions<null, unknown, number, unknown>,
    'mutationFn'
  >
): (() => UseMutationResult<null, unknown, number, unknown>) => {
  const handler = createDeleteHandler(url, fetchOptions);

  return () => {
    const queryClient = useQueryClient();
    return useMutation(
      handler,
      makeUseMutationOptions(queryClient, key, mutationOptions)
    );
  };
};

/**
 * Returns an async function which takes the context as an argument, runs the prefetch, and returns the query state
 */
export const createPrefetch = <Result>(
  key: string[],
  url: string,
  fetchOptions?: RequestInit
): ((scaffoldContext: ScaffoldedContext) => Promise<{
  data: Result | undefined;
  state: QueryState<Result> | undefined;
}>) => {
  return async (scaffoldContext) => {
    // Build get handler
    const handler = async (): Promise<Result> => {
      const res = await scaffoldContext.apiFetch(url, fetchOptions);
      return handleResponseData(res, fetchOptions?.method || 'get');
    };

    await scaffoldContext.queryClient.prefetchQuery(key, handler);

    return {
      data: scaffoldContext.queryClient.getQueryData<Result>(key),
      state: scaffoldContext.queryClient.getQueryState(key),
    };
  };
};
