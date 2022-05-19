/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { QueryState } from 'react-query/types/core/query';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from 'react-query';

import APIError from 'utils/apiError';
import { defaultFetch } from 'fetching';
import handleResponseData from './handleResponseData';
import { makeUseMutationOptions } from './makeUseMutationOptions';
import { ScaffoldedContext } from 'utils/next';
import {
  createDeleteHandler,
  createPatchHandler,
  createPutHandler,
} from './createHandlers';

type FactoryUseQueryOptions<Result> = Omit<
  UseQueryOptions<unknown, unknown, Result, string[]>,
  'queryKey' | 'queryFn'
>;

export const createUseQuery = <Result>(
  key: string[],
  url: string,
  fetchOptions?: RequestInit
): ((options?: FactoryUseQueryOptions<Result>) => UseQueryResult<Result>) => {
  const handler = async () => {
    const res = await defaultFetch(url, fetchOptions);
    return handleResponseData(res, fetchOptions?.method || 'GET');
  };

  return (options?: FactoryUseQueryOptions<Result>) => {
    return useQuery(key, handler, options);
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

interface MutationProps {
  key: string[];
  url: string;
  fetchOptions?: RequestInit;
  mutationOptions?: Omit<
    UseMutationOptions<null, unknown, number | undefined, unknown>,
    'mutationFn'
  >;
}

export const createUseMutationDelete = (
  props: MutationProps
): (() => UseMutationResult<null, unknown, number | undefined, unknown>) => {
  const handler = createDeleteHandler(props.url, props.fetchOptions);

  return () => {
    const queryClient = useQueryClient();
    return useMutation(
      handler,
      makeUseMutationOptions(queryClient, props.key, props.mutationOptions)
    );
  };
};

export const createUseMutationPut = (
  props: MutationProps
): (() => UseMutationResult<null, unknown, number | undefined, unknown>) => {
  const handler = createPutHandler(props.url, props.fetchOptions);

  return () => {
    const queryClient = useQueryClient();
    return useMutation(
      handler,
      makeUseMutationOptions(queryClient, props.key, props.mutationOptions)
    );
  };
};

export const createUseMutationPutWithBody = <
  Input extends { id: number }
>(props: {
  key: string[];
  url: string;
}): (() => UseMutationResult<null, unknown, Input, unknown>) => {
  const handler = async (resource: Input): Promise<null> => {
    const { id, ...body } = resource;
    const requestOptions: RequestInit = {
      method: 'PUT',
    };
    if (body) {
      requestOptions.body = JSON.stringify(body);
      requestOptions.headers = {
        'Content-Type': 'application/json',
      };
    }

    const res = await defaultFetch(`${props.url}/${id}`, requestOptions);

    if (!res.ok) {
      throw new APIError('PUT', res.url);
    }
    return null;
  };

  return () => {
    const queryClient = useQueryClient();
    return useMutation(handler, makeUseMutationOptions(queryClient, props.key));
  };
};

export const createUseMutationPatch = <
  Input extends { id: number },
  Result
>(props: {
  key: string[];
  url: string;
}): (() => UseMutationResult<Result, unknown, Input, unknown>) => {
  const handler = createPatchHandler<Input, Result>(props.url);

  return () => {
    const queryClient = useQueryClient();
    return useMutation(handler, makeUseMutationOptions(queryClient, props.key));
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
  data?: Result;
  state?: QueryState<Result>;
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
