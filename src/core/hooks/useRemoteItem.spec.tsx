import { describe, expect, it, jest } from '@jest/globals';
import { act, render } from '@testing-library/react';
import { FC, Suspense } from 'react';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { configureStore, PayloadAction } from '@reduxjs/toolkit';

import { RemoteItem, remoteItem } from 'utils/storeUtils';
import useRemoteItem from './useRemoteItem';

type ItemObjectForTest = { id: number; name: string };
type StoreState = {
  item: RemoteItem<ItemObjectForTest> | null;
};

describe('useRemoteItem()', () => {
  it('deduplicates loader across two components using same cacheKey on initial load', async () => {
    const { hooks, promise, render } = setupWrapperComponent();

    const { queryByText } = render();

    expect(queryByText('loading1')).not.toBeNull();
    expect(queryByText('loading2')).not.toBeNull();

    await act(async () => {
      await promise;
    });

    // Called only once although two components mounted
    expect(hooks.loader).toHaveBeenCalledTimes(1);
  });
  it('triggers a load when the data has not yet been loaded', async () => {
    const { hooks, promise, render, store } = setupWrapperComponent();

    const { queryByText } = render();

    expect(queryByText('loading1')).not.toBeNull();
    expect(queryByText('loading2')).not.toBeNull();

    await act(async () => {
      await promise;
    });

    expect(hooks.loader).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 1,
      type: 'load',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: { id: 1, name: 'Clara Zetkin' },
      type: 'loaded',
    });

    expect(queryByText('loading1')).toBeNull();
    expect(queryByText('loaded1')).not.toBeNull();
    expect(queryByText('loading2')).toBeNull();
    expect(queryByText('loaded2')).not.toBeNull();
  });

  it('returns data without load when the data has been loaded recently', async () => {
    const { hooks, promise, render, store } = setupWrapperComponent({
      ...remoteItem(1, {
        data: {
          id: 1,
          name: 'Rosa Luxemburg',
        },
      }),
      loaded: new Date().toISOString(),
    });

    const { queryByText, queryAllByText } = render();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(hooks.loader).not.toHaveBeenCalled();
    expect(queryByText('loading1')).toBeNull();
    expect(queryByText('loaded1')).not.toBeNull();
    expect(queryByText('loading2')).toBeNull();
    expect(queryByText('loaded2')).not.toBeNull();

    expect(queryAllByText('Rosa Luxemburg')).toHaveLength(2);

    await act(async () => {
      await promise;
    });

    expect(queryAllByText('Rosa Luxemburg')).toHaveLength(2);
  });

  it('returns stale data while re-loading', async () => {
    const { hooks, promise, render, store } = setupWrapperComponent({
      ...remoteItem(1, {
        data: {
          id: 1,
          name: 'Rosa Luxemburg',
        },
      }),
      loaded: new Date(1857, 6, 5).toISOString(),
    });

    const { queryByText, queryAllByText } = render();

    expect(queryAllByText('Rosa Luxemburg')).toHaveLength(2);
    expect(queryByText('loading1')).toBeNull();
    expect(queryByText('loaded1')).not.toBeNull();
    expect(queryByText('loading2')).toBeNull();
    expect(queryByText('loaded2')).not.toBeNull();

    await act(async () => {
      await promise;
    });

    expect(hooks.loader).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(queryByText('loading1')).toBeNull();
    expect(queryByText('loaded1')).not.toBeNull();
    expect(queryByText('loading2')).toBeNull();
    expect(queryByText('loaded2')).not.toBeNull();
    expect(queryAllByText('Rosa Luxemburg')).toHaveLength(0);
    expect(queryAllByText('Clara Zetkin')).toHaveLength(2);
  });
});

function setupWrapperComponent(initialItem?: RemoteItem<ItemObjectForTest>) {
  const store = configureStore<StoreState>({
    preloadedState: {
      item: initialItem || null,
    },
    reducer: (state, anyAction) => {
      if (anyAction.type == 'load') {
        const action = anyAction as PayloadAction<number>;
        return {
          item: remoteItem<ItemObjectForTest>(action.payload, {
            data: state?.item?.data ?? null,
            isLoading: true,
            loaded: null,
          }),
        };
      } else if (anyAction.type == 'loaded') {
        const action = anyAction as PayloadAction<ItemObjectForTest>;
        return {
          item: remoteItem(action.payload.id, {
            data: action.payload,
            isLoading: false,
            loaded: new Date().toISOString(),
          }),
        };
      }

      return (
        state || {
          item: null,
        }
      );
    },
  });
  jest.spyOn(store, 'dispatch');

  const promise = Promise.resolve({ id: 1, name: 'Clara Zetkin' });

  const hooks = {
    actionOnLoad: () => ({ payload: 1, type: 'load' }),
    actionOnSuccess: (data: ItemObjectForTest) => ({
      payload: data,
      type: 'loaded',
    }),
    cacheKey: 'test:item:1',
    loader: () => promise,
  };

  jest.spyOn(hooks, 'loader');

  const Component: FC = () => {
    const item = useSelector<StoreState, RemoteItem<ItemObjectForTest> | null>(
      (state) => state.item
    );

    const data = useRemoteItem(item, hooks);

    return (
      <div>
        <p>loaded1</p>
        <small>{data.name}</small>
      </div>
    );
  };

  const Component2: FC = () => {
    const item = useSelector<StoreState, RemoteItem<ItemObjectForTest> | null>(
      (state) => state.item
    );

    const data = useRemoteItem(item, hooks);

    return (
      <div>
        <p>loaded2</p>
        <small>{data.name}</small>
      </div>
    );
  };

  return {
    hooks,
    promise,
    render: () =>
      render(
        <ReduxProvider store={store}>
          <Suspense fallback={<p>loading1</p>}>
            <Component />
          </Suspense>
          <Suspense fallback={<p>loading2</p>}>
            <Component2 />
          </Suspense>
        </ReduxProvider>
      ),
    store,
  };
}
