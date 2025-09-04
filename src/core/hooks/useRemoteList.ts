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
  }
): DataType[] {
  const dispatch = useAppDispatch();
  const loadIsNecessary = hooks.isNecessary?.() ?? shouldLoad(remoteList);

  const promiseKey = hooks.cacheKey || hooks.loader.toString();
  const { cache } = usePromiseCache(promiseKey);

  if (!remoteList || loadIsNecessary) {
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

    if (!remoteList?.items.length) {
      throw promise;
    }
  }

  return remoteList.items
    .filter((item) => !item.deleted)
    .map((item) => item.data)
    .filter((data) => !!data) as DataType[];
}
