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
  }
): DataType {
  const dispatch = useAppDispatch();
  const loadIsNecessary = hooks.isNecessary?.() ?? shouldLoad(remoteItem);

  const promiseKey = hooks.cacheKey || hooks.loader.toString();
  const { cache } = usePromiseCache(promiseKey);

  if (loadIsNecessary) {
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

    if (remoteItem?.data) {
      return remoteItem.data;
    } else {
      throw promise;
    }
  }

  if (!remoteItem?.data) {
    throw new Error('Item not loading or loaded');
  }

  return remoteItem.data;
}
