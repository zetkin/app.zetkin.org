import { describe, expect, it, jest } from '@jest/globals';
import { act, render } from '@testing-library/react';
import { FC } from 'react';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import useRemoteListFuture from './useRemoteListFuture';
import { RemoteList, remoteList } from 'utils/storeUtils';

type ListObjectForTest = { id: number; name: string };
type StoreState = {
  list: RemoteList<ListObjectForTest>;
};

type RemoteListHooksForTest = {
  actionOnError?: (err: unknown) => { payload: unknown; type: string };
  actionOnLoad: () => { payload: undefined; type: string };
  actionOnSuccess: (items: ListObjectForTest[]) => {
    payload: ListObjectForTest[];
    type: string;
  };
  cacheKey?: string;
  isNecessary?: () => boolean;
  loader: () => Promise<ListObjectForTest[]>;
  staleWhileRevalidate?: boolean;
};

describe('useRemoteListFuture()', () => {
  it('reports loading without suspending and triggers a load when the data has not yet been loaded', async () => {
    const { hooks, promise, render, store } = setupWrapperComponent();
    hooks.cacheKey = 'list-future-initial';

    const { queryByText } = render();

    expect(queryByText('loading')).not.toBeNull();
    expect(queryByText('loaded')).toBeNull();

    await act(async () => {
      await promise;
    });

    expect(hooks.loader).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: undefined,
      type: 'load',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: [{ id: 1, name: 'Clara Zetkin' }],
      type: 'loaded',
    });

    expect(queryByText('loading')).toBeNull();
    expect(queryByText('loaded')).not.toBeNull();
  });

  it('returns data without load when the data has been loaded recently', async () => {
    const { hooks, render, store } = setupWrapperComponent({
      ...remoteList([
        {
          id: 1,
          name: 'Clara Zetkin',
        },
      ]),
      loaded: new Date().toISOString(),
    });
    hooks.cacheKey = 'list-future-loaded';

    const { queryByText } = render();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(hooks.loader).not.toHaveBeenCalled();
    expect(queryByText('loading')).toBeNull();
    expect(queryByText('loaded')).not.toBeNull();

    const listItem = queryByText('Clara Zetkin');
    expect(listItem?.tagName).toBe('LI');
  });

  it('returns stale data while re-fetching', async () => {
    const { hooks, promise, render, store } = setupWrapperComponent({
      ...remoteList([
        {
          id: 1,
          name: 'Clara Zetkin',
        },
      ]),
      loaded: new Date(1857, 6, 5).toISOString(),
    });
    hooks.cacheKey = 'list-future-stale';

    const { queryByText } = render();

    expect(queryByText('loading')).toBeNull();
    expect(queryByText('Clara Zetkin')).not.toBeNull();

    await act(async () => {
      await promise;
    });

    expect(hooks.loader).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });

  it('reports loading instead of stale data when staleWhileRevalidate is disabled', async () => {
    const { hooks, promise, render } = setupWrapperComponent({
      ...remoteList([
        {
          id: 1,
          name: 'Clara Zetkin',
        },
      ]),
      loaded: new Date(1857, 6, 5).toISOString(),
    });
    hooks.cacheKey = 'list-future-no-swr';
    hooks.staleWhileRevalidate = false;

    const { queryByText } = render();

    expect(queryByText('loading')).not.toBeNull();
    expect(queryByText('Clara Zetkin')).toBeNull();

    await act(async () => {
      await promise;
    });
  });

  it('only fires one load for concurrent consumers', async () => {
    const { hooks, promise, render } = setupWrapperComponent(undefined, 2);
    hooks.cacheKey = 'list-future-dedupe';

    render();

    await act(async () => {
      await promise;
    });

    expect(hooks.loader).toHaveBeenCalledTimes(1);
  });
});

function setupWrapperComponent(
  initialList?: RemoteList<ListObjectForTest>,
  componentCount = 1
) {
  const store = configureStore<StoreState>({
    preloadedState: {
      list: initialList || remoteList(),
    },
    reducer: (state, action) => {
      if (action.type == 'load') {
        return {
          list: {
            ...remoteList(),
            isLoading: true,
          },
        };
      } else if (action.type == 'loaded') {
        return {
          list: {
            ...remoteList(),
            isLoading: false,
            loaded: new Date().toISOString(),
          },
        };
      }

      return (
        state || {
          list: remoteList(),
        }
      );
    },
  });
  jest.spyOn(store, 'dispatch');

  const promise = Promise.resolve([{ id: 1, name: 'Clara Zetkin' }]);

  const hooks: RemoteListHooksForTest = {
    actionOnLoad: () => ({ payload: undefined, type: 'load' }),
    actionOnSuccess: (data: ListObjectForTest[]) => ({
      payload: data,
      type: 'loaded',
    }),
    loader: () => promise,
  };

  jest.spyOn(hooks, 'loader');

  const Component: FC = () => {
    const list = useSelector<StoreState, RemoteList<ListObjectForTest>>(
      (state) => state.list
    );

    const future = useRemoteListFuture(list, hooks);

    if (future.isLoading && !future.data?.length) {
      return <p>loading</p>;
    }

    return (
      <div>
        <p>loaded</p>
        <ul>
          {(future.data || []).map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>
    );
  };

  return {
    hooks,
    promise,
    render: () =>
      render(
        <ReduxProvider store={store}>
          {new Array(componentCount).fill(0).map((_, idx) => (
            <Component key={idx} />
          ))}
        </ReduxProvider>
      ),
    store,
  };
}
