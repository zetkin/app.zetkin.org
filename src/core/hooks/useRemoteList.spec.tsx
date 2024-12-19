import { describe, expect, it, jest } from '@jest/globals';
import { act, render } from '@testing-library/react';
import { FC, Suspense } from 'react';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import useRemoteList from './useRemoteList';
import { RemoteList, remoteList } from 'utils/storeUtils';

type ListObjectForTest = { id: number; name: string };
type StoreState = {
  list: RemoteList<ListObjectForTest>;
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

  it('returns stale data while re-loading', async () => {
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

  const hooks = {
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
