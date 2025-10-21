import { PayloadAction } from '@reduxjs/toolkit';
import { useEffect } from 'react';

import { useAppDispatch } from './index';
import shouldLoad from '../caching/shouldLoad';
import usePromiseCache from './usePromiseCache';
import { RemoteItem, RemoteList } from '../../utils/storeUtils';
import { AppDispatch } from 'core/store';

export type Hooks<
  DataType,
  OnLoadPayload = void,
  OnSuccessPayload = DataType
> = {
  actionOnError?: (err: unknown) => PayloadAction<unknown>;
  actionOnLoad: () => PayloadAction<OnLoadPayload>;
  actionOnSuccess:
    | ((item: DataType) => PayloadAction<OnSuccessPayload>)
    | ((items: DataType[]) => PayloadAction<OnSuccessPayload>);
  cacheKey?: string;
  isNecessary?: () => boolean;
  loader: (() => Promise<DataType>) | (() => Promise<DataType[]>);
};

async function makePromise<
  DataType,
  OnLoadPayload = void,
  OnSuccessPayload = DataType
>(
  dispatch: AppDispatch,
  hooks: Hooks<DataType, OnLoadPayload, OnSuccessPayload>
): Promise<DataType | DataType[] | null> {
  try {
    await Promise.resolve();
    dispatch(hooks.actionOnLoad());
    const val = await hooks.loader();
    dispatch(hooks.actionOnSuccess(val as never));
    return val;
  } catch (err) {
    {
      if (hooks.actionOnError) {
        dispatch(hooks.actionOnError(err));
        return null;
      } else {
        throw err;
      }
    }
  }
}

function useRemoteObject<
  DataType,
  OnLoadPayload = void,
  OnSuccessPayload = DataType
>(
  remoteObject: RemoteItem<DataType> | RemoteList<DataType> | undefined | null,
  hooks: Hooks<DataType, OnLoadPayload, OnSuccessPayload>
) {
  const dispatch = useAppDispatch();
  const loadIsNecessary = hooks.isNecessary?.() ?? shouldLoad(remoteObject);

  const promiseKey = hooks.cacheKey || hooks.loader.toString();

  const stateHasLoadedOnce =
    remoteObject &&
    (remoteObject.isLoading ||
      remoteObject.error ||
      remoteObject.loaded ||
      'data' in remoteObject ||
      ('items' in remoteObject && remoteObject.items.length > 0) ||
      ('isStale' in remoteObject && remoteObject.isStale) ||
      ('mutating' in remoteObject &&
        (remoteObject.mutating as string[]).length > 0));

  // initial load, suspense based data loading
  {
    const { cache, getOldPromise } = usePromiseCache(
      'suspense_based_' + promiseKey
    );
    const oldPromise = getOldPromise();
    if (oldPromise) {
      throw oldPromise; // throws cached promise, so second component won't call API
    }

    if (loadIsNecessary && !stateHasLoadedOnce) {
      // on server, we don't trigger the load promise as the server can't change the redux state
      if (typeof window === 'undefined') {
        throw Promise.resolve();
      }

      const promise = makePromise<DataType, OnLoadPayload, OnSuccessPayload>(
        dispatch,
        hooks
      );

      // cache the promise, so other components using the same hook don't also call the API
      cache(promise);

      throw promise;
    }
  }

  // consecutive loads, hook based loading (keeps stale data until update arrives)
  {
    const { cache, getOldPromise } = usePromiseCache(
      'hook_based_' + promiseKey
    );

    useEffect(() => {
      if (!loadIsNecessary || !stateHasLoadedOnce || getOldPromise()) {
        return;
      }

      const promise = makePromise(dispatch, hooks);

      // cache the promise, so other components using the same hook don't also call the API
      cache(promise);
    }, [
      loadIsNecessary,
      stateHasLoadedOnce,
      dispatch,
      hooks.actionOnError,
      hooks.actionOnLoad,
      hooks.actionOnSuccess,
      hooks.loader,
      cache,
      getOldPromise,
    ]);
  }
}

export default useRemoteObject;
