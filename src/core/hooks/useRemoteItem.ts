import { PayloadAction } from '@reduxjs/toolkit';

import shouldLoad from 'core/caching/shouldLoad';
import { RemoteItem } from 'utils/storeUtils';
import { useAppDispatch } from '.';
import usePromiseCache from './usePromiseCache';

export default function useRemoteItem<
  DataType,
  OnLoadPayload = void,
  OnSuccessPayload = DataType
>(
  remoteItem: RemoteItem<DataType> | undefined | null,
  hooks: {
    actionOnError?: (err: unknown) => PayloadAction<unknown>;
    actionOnLoad: () => PayloadAction<OnLoadPayload>;
    actionOnSuccess: (items: DataType) => PayloadAction<OnSuccessPayload>;
    cacheKey?: string;
    isNecessary?: () => boolean;
    loader: () => Promise<DataType>;
    staleWhileRevalidate?: boolean;
  }
): DataType {
  const dispatch = useAppDispatch();
  const loadIsNecessary = hooks.isNecessary?.() ?? shouldLoad(remoteItem);

  const promiseKey = hooks.cacheKey || hooks.loader.toString();
  const { cache, getExistingPromise } = usePromiseCache(promiseKey);
  const staleWhileRevalidate = hooks.staleWhileRevalidate ?? true;

  if (!remoteItem) {
    const existing = getExistingPromise();
    if (!existing) {
      const promise = Promise.resolve()
        .then(() => {
          dispatch(hooks.actionOnLoad());
        })
        .then(() => hooks.loader())
        .then((val) => {
          dispatch(hooks.actionOnSuccess(val));
          return val;
        })
        .catch((err) => {
          if (hooks.actionOnError) {
            dispatch(hooks.actionOnError(err));
          } else {
            throw err;
          }
        });
      cache(promise);
    }
    throw getExistingPromise()!;
  }

  if (remoteItem.isLoading && !remoteItem.data) {
    const existing = getExistingPromise();
    if (!existing) {
      const promise = Promise.resolve()
        // No need to dispatch actionOnLoad: already loading
        .then(() => hooks.loader())
        .then((val) => {
          dispatch(hooks.actionOnSuccess(val));
          return val;
        })
        .catch((err) => {
          if (hooks.actionOnError) {
            dispatch(hooks.actionOnError(err));
          } else {
            throw err;
          }
        });
      cache(promise);
    }
    throw getExistingPromise()!;
  }

  if (loadIsNecessary) {
    const existing = getExistingPromise();
    if (!existing) {
      const promise = Promise.resolve()
        .then(() => {
          dispatch(hooks.actionOnLoad());
        })
        .then(() => hooks.loader())
        .then((val) => {
          dispatch(hooks.actionOnSuccess(val));
          return val;
        })
        .catch((err) => {
          if (hooks.actionOnError) {
            dispatch(hooks.actionOnError(err));
          }
        });

      cache(promise);
    }

    // Suspend if no data exists, or if staleWhileRevalidate is disabled
    const hasData = !!remoteItem?.data;
    const shouldSuspend = !hasData || !staleWhileRevalidate;
    if (shouldSuspend) {
      const toThrow = getExistingPromise();
      if (toThrow) {
        throw toThrow;
      }
    }
  }

  if (!remoteItem?.data) {
    throw new Error('Item not loading or loaded');
  }

  return remoteItem.data;
}
