import { afterEach, describe, expect, it, jest } from '@jest/globals';

import { act, makeWrapper, renderHook } from 'utils/testing';
import createStore from 'core/store';
import mockApiClient from 'utils/testing/mocks/mockApiClient';
import useUserSearch from './useUserSearch';
import { ZetkinUser } from 'utils/types/zetkin';
import RosaLuxemburgUser from '../../../../integrationTesting/mockData/users/RosaLuxemburgUser';

afterEach(() => {
  jest.useRealTimers();
});

describe('useUserSearch', () => {
  it('stays idle for empty queries and clears results when the query is cleared', async () => {
    jest.useFakeTimers();
    const apiClient = mockApiClient();
    apiClient.rpc.mockResolvedValue([RosaLuxemburgUser]);
    const { rerender, result } = renderHook(
      ({ query }) => useUserSearch(query),
      {
        initialProps: { query: '' },
        wrapper: makeWrapper(createStore(), apiClient),
      }
    );

    await act(async () => jest.advanceTimersByTime(300));
    expect(apiClient.rpc).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);

    rerender({ query: 'deutsch' });
    await act(async () => jest.advanceTimersByTime(300));
    expect(result.current.users).toEqual([RosaLuxemburgUser]);

    rerender({ query: '   ' });
    await act(async () => jest.advanceTimersByTime(300));
    expect(apiClient.rpc).toHaveBeenCalledTimes(1);
    expect(result.current.users).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('debounces queries and ignores responses from an earlier search', async () => {
    jest.useFakeTimers();
    const apiClient = mockApiClient();
    let resolveEarlierSearch: (users: ZetkinUser[]) => void = () => {};
    const earlierSearch = new Promise<ZetkinUser[]>((resolve) => {
      resolveEarlierSearch = resolve;
    });
    apiClient.rpc.mockReturnValueOnce(earlierSearch);
    apiClient.rpc.mockResolvedValueOnce([RosaLuxemburgUser]);
    const { rerender, result } = renderHook(
      ({ query }) => useUserSearch(query),
      {
        initialProps: { query: 'earlier' },
        wrapper: makeWrapper(createStore(), apiClient),
      }
    );

    await act(async () => jest.advanceTimersByTime(300));
    rerender({ query: 'intermediate' });
    rerender({ query: 'latest' });
    expect(result.current.users).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    await act(async () => jest.advanceTimersByTime(300));
    expect(apiClient.rpc).toHaveBeenCalledTimes(2);
    expect(result.current.users).toEqual([RosaLuxemburgUser]);

    await act(async () => resolveEarlierSearch([]));
    expect(result.current.users).toEqual([RosaLuxemburgUser]);
    expect(result.current.isLoading).toBe(false);
  });
});
