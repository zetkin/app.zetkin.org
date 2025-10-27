import { PayloadAction } from '@reduxjs/toolkit';

import shouldLoad from 'core/caching/shouldLoad';
import { RemoteList } from 'utils/storeUtils';
import { useAppDispatch } from '.';
import usePromiseCache from './usePromiseCache';

export default function useRemoteList<
  DataType,
  OnLoadPayload = void,
  OnSuccessPayload = DataType[]
>(
  remoteList: RemoteList<DataType> | undefined,
  hooks: {
    actionOnError?: (err: unknown) => PayloadAction<unknown>;
    actionOnLoad: () => PayloadAction<OnLoadPayload>;
    actionOnSuccess: (items: DataType[]) => PayloadAction<OnSuccessPayload>;
    cacheKey?: string;
    isNecessary?: () => boolean;
    loader: () => Promise<DataType[]>;
    staleWhileRevalidate?: boolean;
  }
): DataType[] {
  const dispatch = useAppDispatch();
  const loadIsNecessary = hooks.isNecessary?.() ?? shouldLoad(remoteList);

  const promiseKey = hooks.cacheKey || hooks.loader.toString();
  const { cache, getExisting } = usePromiseCache(promiseKey);
  const staleWhileRevalidate = hooks.staleWhileRevalidate ?? true;

  if (!remoteList) {
    const existing = getExisting();
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
        .catch((err: unknown) => {
          if (hooks.actionOnError) {
            dispatch(hooks.actionOnError(err));
            return null;
          } else {
            throw err;
          }
        });

      cache(promise);
    }

    // No data at all: must suspend
    throw getExisting()!;
  }

  if (loadIsNecessary) {
    const existing = getExisting();
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
        .catch((err: unknown) => {
          if (hooks.actionOnError) {
            dispatch(hooks.actionOnError(err));
            return null;
          } else {
            throw err;
          }
        });

      cache(promise);
    }

    // Suspend if no items exist, or if staleWhileRevalidate is disabled
    const hasData = remoteList.items.length > 0;
    if (!hasData || !staleWhileRevalidate) {
      throw getExisting()!;
    }
  }

  return remoteList.items
    .filter((item) => !item.deleted)
    .map((item) => item.data)
    .filter((data) => !!data) as DataType[];
}
