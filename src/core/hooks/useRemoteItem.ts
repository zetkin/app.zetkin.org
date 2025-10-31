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
  const { cache, getExisting } = usePromiseCache(promiseKey);
  const staleWhileRevalidate = hooks.staleWhileRevalidate ?? true;

  if (loadIsNecessary) {
    const existing = getExisting();
    if (!existing) {
      dispatch(hooks.actionOnLoad());

      const promise = hooks
        .loader()
        .then((data) => {
          dispatch(hooks.actionOnSuccess(data));
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
    if (!hasData || !staleWhileRevalidate) {
      const toThrow = getExisting();
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
