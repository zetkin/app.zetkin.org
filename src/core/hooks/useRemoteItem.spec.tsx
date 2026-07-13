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
      payload: 1,
      type: 'load',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: { id: 1, name: 'Clara Zetkin' },
      type: 'loaded',
    });

    expect(queryByText('loading')).toBeNull();
    expect(queryByText('loaded')).not.toBeNull();
  });

  it('returns data without load when the data has been loaded recently', async () => {
    const { hooks, render, store } = setupWrapperComponent({
      ...remoteItem(1, {
        data: {
          id: 1,
          name: 'Clara Zetkin',
        },
      }),
      loaded: new Date().toISOString(),
    });

    const { queryByText } = render();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(hooks.loader).not.toHaveBeenCalled();
    expect(queryByText('loading')).toBeNull();
    expect(queryByText('loaded')).not.toBeNull();

    const listItem = queryByText('Clara Zetkin');
    expect(listItem).not.toBeNull();
  });

  it('returns stale data while re-loading', async () => {
    const { hooks, promise, render, store } = setupWrapperComponent({
      ...remoteItem(1, {
        data: {
          id: 1,
          name: 'Clara Zetkin',
        },
      }),
      loaded: new Date(1857, 6, 5).toISOString(),
    });

    const { queryByText } = render();

    expect(queryByText('Clara Zetkin')).not.toBeNull();

    await act(async () => {
      await promise;
    });

    expect(hooks.loader).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledTimes(2);
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
        <p>loaded</p>
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
          <Suspense fallback={<p>loading</p>}>
            <Component />
          </Suspense>
        </ReduxProvider>
      ),
    store,
  };
}
