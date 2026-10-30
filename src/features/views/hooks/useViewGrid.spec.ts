import { describe, expect, it, jest } from '@jest/globals';

import loadViewGrid from './useViewGrid';
import loadView from './useView';
import viewsSlice, { viewLoadRetry } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

jest.mock('core/hooks');
jest.mock('features/tags/hooks/useTagging', () => () => ({
  assignToPerson: jest.fn(),
  removeFromPerson: jest.fn(),
}));

describe('list loading failures', () => {
  it.each(['rows', 'columns', 'view'])(
    'stops loading and allows retry after a failed %s request',
    async (resource) => {
      let state = viewsSlice.reducer(undefined, { type: 'init' });
      const get = jest.fn((url: string) => {
        const requestedResource = url.endsWith('/rows')
          ? 'rows'
          : url.endsWith('/columns')
            ? 'columns'
            : 'view';
        return requestedResource === resource
          ? Promise.reject(new Error('Request failed'))
          : Promise.resolve([]);
      });
      jest.mocked(useApiClient).mockReturnValue({ get } as never);
      jest.mocked(useAppDispatch).mockReturnValue(((action: never) => {
        state = viewsSlice.reducer(state, action);
      }) as never);
      jest
        .mocked(useAppSelector)
        .mockImplementation((selector) => selector({ views: state } as never));

      const load = () =>
        resource === 'view'
          ? loadView(1, 123)
          : loadViewGrid(1, 123)[
              resource === 'rows' ? 'rowsFuture' : 'columnsFuture'
            ];

      expect(load().isLoading).toBe(true);
      await new Promise((resolve) => setTimeout(resolve, 0));

      const failed = load();
      expect(failed.isLoading).toBe(false);
      expect(failed.error).toBe('Request failed');
      const requestCount = get.mock.calls.length;
      load();
      expect(get).toHaveBeenCalledTimes(requestCount);

      state = viewsSlice.reducer(state, viewLoadRetry([1, 123]));
      get.mockResolvedValue(resource === 'view' ? ({ id: 123 } as never) : []);
      expect(load().isLoading).toBe(true);
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(load().error).toBeNull();
      expect(load().isLoading).toBe(false);
    }
  );
});
