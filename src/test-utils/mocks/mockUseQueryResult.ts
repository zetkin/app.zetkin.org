/* eslint-disable @typescript-eslint/ban-ts-comment */

import { mockObject } from './index';
import {
    QueryObserverLoadingErrorResult,
    QueryObserverLoadingResult,
    QueryObserverResult,
    QueryObserverSuccessResult,
    QueryStatus,
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

const mockUseQueryResult = <TData>(
    status: QueryStatus,
    data?: TData,
): QueryObserverLoadingResult<undefined> |
   QueryObserverLoadingErrorResult<undefined> |
   QueryObserverSuccessResult<TData> |
   QueryObserverResult => {

    if (status === 'loading') {
        return mockObject(
            useQueryResult,
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

    if (status === 'success') {
        return mockObject(
        useQueryResult as unknown as QueryObserverSuccessResult<TData>,
        {
            data: data,
            isSuccess: true,
            status: 'success',
        });
    }

    // If no arguments passed, return base query result
    return useQueryResult;
};

export default mockUseQueryResult;
