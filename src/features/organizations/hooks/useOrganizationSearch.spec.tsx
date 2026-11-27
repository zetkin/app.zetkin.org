import { afterEach, describe, expect, it, jest } from '@jest/globals';

import { act, makeWrapper, renderHook } from 'utils/testing';
import createStore from 'core/store';
import mockApiClient from 'utils/testing/mocks/mockApiClient';
import useOrganizationSearch from './useOrganizationSearch';
import { ZetkinOrganization } from 'utils/types/zetkin';
import KPD from '../../../../integrationTesting/mockData/orgs/KPD';

afterEach(() => {
  jest.useRealTimers();
});

describe('useOrganizationSearch', () => {
  it('stays idle for empty queries and clears results when the query is cleared', async () => {
    jest.useFakeTimers();
    const apiClient = mockApiClient();
    apiClient.rpc.mockResolvedValue([KPD]);
    const { rerender, result } = renderHook(
      ({ query }) => useOrganizationSearch(query),
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
    expect(result.current.organizations).toEqual([KPD]);

    rerender({ query: '   ' });
    await act(async () => jest.advanceTimersByTime(300));
    expect(apiClient.rpc).toHaveBeenCalledTimes(1);
    expect(result.current.organizations).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('debounces queries and ignores responses from an earlier search', async () => {
    jest.useFakeTimers();
    const apiClient = mockApiClient();
    let resolveEarlierSearch: (
      organizations: ZetkinOrganization[]
    ) => void = () => {};
    const earlierSearch = new Promise<ZetkinOrganization[]>((resolve) => {
      resolveEarlierSearch = resolve;
    });
    apiClient.rpc.mockReturnValueOnce(earlierSearch);
    apiClient.rpc.mockResolvedValueOnce([KPD]);
    const { rerender, result } = renderHook(
      ({ query }) => useOrganizationSearch(query),
      {
        initialProps: { query: 'earlier' },
        wrapper: makeWrapper(createStore(), apiClient),
      }
    );

    await act(async () => jest.advanceTimersByTime(300));
    rerender({ query: 'intermediate' });
    rerender({ query: 'latest' });
    expect(result.current.organizations).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    await act(async () => jest.advanceTimersByTime(300));
    expect(apiClient.rpc).toHaveBeenCalledTimes(2);
    expect(result.current.organizations).toEqual([KPD]);

    await act(async () => resolveEarlierSearch([]));
    expect(result.current.organizations).toEqual([KPD]);
    expect(result.current.isLoading).toBe(false);
  });
});
