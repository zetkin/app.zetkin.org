import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';

import IApiClient from 'core/api/client/IApiClient';
import createStore from 'core/store';
import { makeWrapper } from 'utils/testing';
import mockApiClient from 'utils/testing/mocks/mockApiClient';
import mockState from 'utils/testing/mocks/mockState';
import useViewSharing from './useViewSharing';
import { Zetkin2ListAccess } from '../types';

const ORG_ID = 1;
const VIEW_ID = 1;

const makeAccess = (userId: number): Zetkin2ListAccess => ({
  granted: '2026-01-01T00:00:00',
  granted_by_user_id: 1,
  id: userId,
  level: 'readonly',
  user_id: userId,
});

describe('useViewSharing()', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('fetches all pages of list access', async () => {
    const firstPage = Array.from({ length: 100 }, (_, index) =>
      makeAccess(index + 1)
    );
    const secondPage = [101, 102, 103].map(makeAccess);

    const get = jest.fn((url: string) => {
      if (url.includes(`/lists/${VIEW_ID}/access?`)) {
        return Promise.resolve(url.includes('page=2') ? secondPage : firstPage);
      }

      return Promise.resolve([]);
    });

    const apiClient = mockApiClient({
      get: get as unknown as jest.Mock<IApiClient['get']>,
    });
    const store = createStore(mockState());

    const { result } = renderHook(() => useViewSharing(ORG_ID, VIEW_ID), {
      wrapper: makeWrapper(store, apiClient),
    });

    await waitFor(() =>
      expect(result.current.accessListFuture.data).toHaveLength(103)
    );

    expect(get).toHaveBeenCalledWith(
      `/api2/orgs/${ORG_ID}/lists/${VIEW_ID}/access?size=100&page=1`
    );
    expect(get).toHaveBeenCalledWith(
      `/api2/orgs/${ORG_ID}/lists/${VIEW_ID}/access?size=100&page=2`
    );
  });
});
