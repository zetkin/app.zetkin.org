import { PayloadAction } from '@reduxjs/toolkit';

import shouldLoad from 'core/caching/shouldLoad';
import { RemoteList } from 'utils/storeUtils';
import { useAppDispatch } from '.';
import usePromiseCache from './usePromiseCache';
import { IFuture, LoadingFuture, RemoteListFuture } from 'core/caching/futures';

/**
 * Non-suspending variant of {@link useRemoteList}: identical loading and
 * caching behavior, but returns an {@link IFuture} instead of throwing the
 * fetch promise. Use it on paths that render on first mount, where committing
 * a Suspense fallback is undesirable (React 19 throttles fallback reveals by
 * up to 300ms, and suspending above a page-level boundary blanks the app).
 */
export default function useRemoteListFuture<
  DataType,
  OnLoadPayload = void,
  OnSuccessPayload = DataType[],
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
): IFuture<DataType[]> {
  const dispatch = useAppDispatch();

  const loadIsNecessary = hooks.isNecessary?.() ?? shouldLoad(remoteList);
  const notLoaded = !remoteList || !remoteList.loaded;

  const promiseKey = hooks.cacheKey || hooks.loader.toString();
  const { cache, getExistingPromise } = usePromiseCache(promiseKey);
  const staleWhileRevalidate = hooks.staleWhileRevalidate ?? true;

  const fireLoadIfNotInFlight = () => {
    if (getExistingPromise()) {
      return;
    }

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
  };

  if (notLoaded) {
    fireLoadIfNotInFlight();
    return new LoadingFuture();
  }

  if (loadIsNecessary) {
    fireLoadIfNotInFlight();

    const hasData = !!remoteList.items?.length;
    if (!hasData || !staleWhileRevalidate) {
      return new LoadingFuture();
    }
  }

  return new RemoteListFuture({
    ...remoteList,
    items: remoteList.items.filter((item) => !item.deleted),
  });
}
