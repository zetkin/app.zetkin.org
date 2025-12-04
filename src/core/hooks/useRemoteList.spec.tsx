import { describe, expect, it, jest } from '@jest/globals';
import { act, render } from '@testing-library/react';
import { FC, Suspense } from 'react';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import useRemoteList from './useRemoteList';
import usePromiseCache from './usePromiseCache';
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

describe('useRemoteList()', () => {
  it('triggers a load when the data has not yet been loaded', async () => {
    const { hooks, promise, render, store } = setupWrapperComponent();

    const { queryByText } = render();

    expect(queryByText('loading')).not.toBeNull();

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

    const { queryByText } = render();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(hooks.loader).not.toHaveBeenCalled();
    expect(queryByText('loading')).toBeNull();
    expect(queryByText('loaded')).not.toBeNull();

    const listItem = queryByText('Clara Zetkin');
    expect(listItem?.tagName).toBe('LI');
  });

  it('throws a promise on initial load', async () => {
    const cacheKey = 'initial-load-test';
    const { hooks, promise, store } = setupWrapperComponent();

    hooks.cacheKey = cacheKey;

    const ListComponent: FC = () => {
      const list = useSelector<StoreState, RemoteList<ListObjectForTest>>(
        (state) => state.list
      );

      useRemoteList(list, hooks);

      return null;
    };

    render(
      <ReduxProvider store={store}>
        <Suspense fallback={<p>loading</p>}>
          <ListComponent />
        </Suspense>
      </ReduxProvider>
    );

    const cachedPromise = usePromiseCache(cacheKey).getExistingPromise();
    expect(cachedPromise).toBeInstanceOf(Promise);

    await act(async () => {
      await promise;
    });
  });

  it('re-fetches when cached data is stale', async () => {
    const { hooks, promise, render, store } = setupWrapperComponent({
      ...remoteList([
        {
          id: 1,
          name: 'Clara Zetkin',
        },
      ]),
      loaded: new Date(1857, 6, 5).toISOString(),
    });

    const { queryByText } = render();

    expect(queryByText('Clara Zetkin')).not.toBeNull();

    await act(async () => {
      await promise;
    });

    expect(hooks.loader).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(queryByText('loading')).toBeNull();
    expect(queryByText('loaded')).not.toBeNull();
  });
});

function setupWrapperComponent(initialList?: RemoteList<ListObjectForTest>) {
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

    const items = useRemoteList(list, hooks);

    return (
      <div>
        <p>loaded</p>
        <ul>
          {items.map((item) => (
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
          <Suspense fallback={<p>loading</p>}>
            <Component />
          </Suspense>
        </ReduxProvider>
      ),
    store,
  };
}
