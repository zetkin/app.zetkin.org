import { PayloadAction } from '@reduxjs/toolkit';

import shouldLoad from 'core/caching/shouldLoad';
import { RemoteItem } from 'utils/storeUtils';
import { useAppDispatch } from '.';
import usePromiseCache from './usePromiseCache';
import { IFuture, LoadingFuture, RemoteItemFuture } from 'core/caching/futures';

export default function useRemoteItemFuture<
  DataType,
  OnLoadPayload = void,
  OnSuccessPayload = DataType,
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
): IFuture<DataType> {
  const dispatch = useAppDispatch();

  const loadIsNecessary = hooks.isNecessary?.() ?? shouldLoad(remoteItem);

  const promiseKey = hooks.cacheKey || hooks.loader.toString();
  const { cache, getExistingPromise } = usePromiseCache(promiseKey);
  const staleWhileRevalidate = hooks.staleWhileRevalidate ?? true;

  const loadOnce = (dispatchLoadAction: boolean) => {
    if (getExistingPromise()) {
      return;
    }

    const promise = Promise.resolve()
      .then(() => {
        if (dispatchLoadAction) {
          dispatch(hooks.actionOnLoad());
        }
      })
      .then(() => hooks.loader())
      .then((val) => {
        dispatch(hooks.actionOnSuccess(val));
        return val;
      })
      .catch((err: unknown) => {
        if (hooks.actionOnError) {
          dispatch(hooks.actionOnError(err));
          return null;
        } else {
          throw err;
        }
      });

    cache(promise);
  };

  if (!remoteItem) {
    loadOnce(true);
    return new LoadingFuture();
  }

  if (remoteItem.isLoading && !remoteItem.data) {
    loadOnce(false);
    return new LoadingFuture();
  }

  if (loadIsNecessary) {
    loadOnce(true);

    if (!remoteItem.data || !staleWhileRevalidate) {
      return new LoadingFuture();
    }
  }

  return new RemoteItemFuture(remoteItem);
}
