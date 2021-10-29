/* eslint-disable @typescript-eslint/ban-ts-comment */

import { mockObject } from './index';
import {
    QueryObserverLoadingErrorResult,
    QueryObserverLoadingResult,
    QueryObserverResult,
    QueryObserverSuccessResult,
    UseQueryResult,
} from 'react-query';

// @ts-ignore
export const useQueryResult: UseQueryResult<undefined> = {
    data: undefined,
    dataUpdatedAt: 1000000,
    error: null,
    errorUpdatedAt: 1000000,
    failureCount: 0,
    isError: false,
    isFetched: false,
    isFetchedAfterMount: false,
    isFetching: false,
    isIdle: false,
    isLoading: false,
    isLoadingError: false,
    isPlaceholderData: false,
    isPreviousData: false,
    isRefetchError: false,
    isRefetching: false,
    isStale: false,
    isSuccess: false,
    refetch: async () => useQueryResult as QueryObserverResult<undefined>,
    remove: () => null,
    status: 'idle',
};


function mockUseQueryResult(status: 'loading', data?: never): QueryObserverLoadingResult<undefined>;
function mockUseQueryResult(status: 'error', data?: never): QueryObserverLoadingErrorResult<undefined>;
function mockUseQueryResult<TData>(status: 'success', data?: TData): QueryObserverSuccessResult<TData>;
function mockUseQueryResult<TData>(
    status: 'loading' | 'error' | 'success',
    data?: TData,
):  QueryObserverLoadingResult<undefined> |
    QueryObserverLoadingErrorResult<undefined> |
    QueryObserverSuccessResult<TData> {
    if (status === 'loading') {
        return mockObject(
            useQueryResult as QueryObserverLoadingResult<undefined>,
            {
                isLoading: true,
                status: 'loading',
            });
    }

    if (status === 'error') {
        return mockObject(
        useQueryResult as QueryObserverLoadingErrorResult<undefined>,
        {
            isError: true,
            status: 'error',
        });
    }

    return mockObject(
        useQueryResult as unknown as QueryObserverSuccessResult<TData>,
        {
            data: data,
            isSuccess: true,
            status: 'success',
        });
}

export default mockUseQueryResult;
