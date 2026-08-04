import { describe, expect, it, jest } from '@jest/globals';
import { act, render } from '@testing-library/react';
import { FC } from 'react';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import useRemoteItemFuture from './useRemoteItemFuture';
import { RemoteItem, remoteItem } from 'utils/storeUtils';

type ItemObjectForTest = { id: number; name: string };
type StoreState = {
  item: RemoteItem<ItemObjectForTest> | null;
};

type RemoteItemHooksForTest = {
  actionOnError?: (err: unknown) => { payload: unknown; type: string };
  actionOnLoad: () => { payload: undefined; type: string };
  actionOnSuccess: (item: ItemObjectForTest) => {
    payload: ItemObjectForTest;
    type: string;
  };
  cacheKey?: string;
  isNecessary?: () => boolean;
  loader: () => Promise<ItemObjectForTest>;
  staleWhileRevalidate?: boolean;
};

describe('useRemoteItemFuture()', () => {
  it('reports loading without suspending and triggers a load when the item does not exist', async () => {
    const { hooks, promise, render, store } = setupWrapperComponent(null);
    hooks.cacheKey = 'item-future-initial';

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

    expect(queryByText('loading')).toBeNull();
    expect(queryByText('Clara Zetkin')).not.toBeNull();
  });

  it('returns data without load when the item has been loaded recently', async () => {
    const { hooks, render, store } = setupWrapperComponent(
      remoteItem(1, {
        data: { id: 1, name: 'Clara Zetkin' },
        loaded: new Date().toISOString(),
      })
    );
    hooks.cacheKey = 'item-future-loaded';

    const { queryByText } = render();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(hooks.loader).not.toHaveBeenCalled();
    expect(queryByText('loading')).toBeNull();
    expect(queryByText('Clara Zetkin')).not.toBeNull();
  });

  it('loads without dispatching actionOnLoad when the item is already marked as loading', async () => {
    const { hooks, promise, render, store } = setupWrapperComponent({
      ...remoteItem<ItemObjectForTest>(1),
      data: null,
      isLoading: true,
    });
    hooks.cacheKey = 'item-future-already-loading';

    const { queryByText } = render();

    expect(queryByText('loading')).not.toBeNull();

    await act(async () => {
      await promise;
    });

    expect(hooks.loader).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith({
      payload: { id: 1, name: 'Clara Zetkin' },
      type: 'loaded',
    });
  });

  it('returns stale data while re-fetching', async () => {
    const { hooks, promise, render, store } = setupWrapperComponent(
      remoteItem(1, {
        data: { id: 1, name: 'Clara Zetkin' },
        loaded: new Date(1857, 6, 5).toISOString(),
      })
    );
    hooks.cacheKey = 'item-future-stale';

    const { queryByText } = render();

    expect(queryByText('loading')).toBeNull();
    expect(queryByText('Clara Zetkin')).not.toBeNull();

    await act(async () => {
      await promise;
    });

    expect(hooks.loader).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });
});

function setupWrapperComponent(
  initialItem: RemoteItem<ItemObjectForTest> | null
) {
  const store = configureStore<StoreState>({
    preloadedState: {
      item: initialItem,
    },
    reducer: (state, action) => {
      if (action.type == 'load') {
        return {
          item: {
            ...remoteItem<ItemObjectForTest>(1),
            isLoading: true,
          },
        };
      } else if (action.type == 'loaded') {
        return {
          item: remoteItem(1, {
            data: { id: 1, name: 'Clara Zetkin' },
            loaded: new Date().toISOString(),
          }),
        };
      }

      return state || { item: null };
    },
  });
  jest.spyOn(store, 'dispatch');

  const promise = Promise.resolve({ id: 1, name: 'Clara Zetkin' });

  const hooks: RemoteItemHooksForTest = {
    actionOnLoad: () => ({ payload: undefined, type: 'load' }),
    actionOnSuccess: (data: ItemObjectForTest) => ({
      payload: data,
      type: 'loaded',
    }),
    loader: () => promise,
  };

  jest.spyOn(hooks, 'loader');

  const Component: FC = () => {
    const item = useSelector<StoreState, RemoteItem<ItemObjectForTest> | null>(
      (state) => state.item
    );

    const future = useRemoteItemFuture(item, hooks);

    if (future.isLoading && !future.data) {
      return <p>loading</p>;
    }

    return (
      <div>
        <p>loaded</p>
        <p>{future.data?.name}</p>
      </div>
    );
  };

  return {
    hooks,
    promise,
    render: () =>
      render(
        <ReduxProvider store={store}>
          <Component />
        </ReduxProvider>
      ),
    store,
  };
}
