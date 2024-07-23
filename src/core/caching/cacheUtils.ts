import { PayloadAction } from '@reduxjs/toolkit';

import { AppDispatch } from 'core/store';
import shouldLoad from './shouldLoad';
import {
  IFuture,
  PromiseFuture,
  RemoteItemFuture,
  RemoteListFuture,
} from './futures';
import { RemoteItem, RemoteList } from 'utils/storeUtils';

/**
 * Used by data fetching hooks to manage cache invalidation and fetching for their collection.
 *
 * A typical call to `loadListIfNecessary` looks like this one.
 *
 * ```typescript
 * const tasksFuture = loadListIfNecessary(tasksList, dispatch, {
 *   actionOnLoad: () => tasksLoad(),
 *   actionOnSuccess: (data) => tasksLoaded(data),
 *   loader: () =>
 *     apiClient.get<ZetkinTask[]>(
 *       `/api/orgs/${orgId}/campaigns/${campId}/tasks`
 *     ),
 * });
 * ```
 *
 * Under the hood, {@link shouldLoad shouldLoad} is used for cache invalidation.
 *
 * @category Cache
 * @param {RemoteList} remoteList The remote list to check and load.
 * @param {AppDispatch} dispatch The Redux dispatch function.
 * @param {Object} hooks Callbacks to handle the loading process.
 * @return {IFuture} An {@link IFuture} object that can be used to render a loading spinner or the data itself.
 */
export function loadListIfNecessary<
  DataType,
  OnLoadPayload = void,
  OnSuccessPayload = DataType[]
>(
  remoteList: RemoteList<DataType> | undefined,
  dispatch: AppDispatch,
  hooks: {
    actionOnError?: (err: unknown) => PayloadAction<unknown>;
    actionOnLoad: () => PayloadAction<OnLoadPayload>;
    actionOnSuccess: (items: DataType[]) => PayloadAction<OnSuccessPayload>;
    isNecessary?: () => boolean;
    loader: () => Promise<DataType[]>;
  }
): IFuture<DataType[]> {
  const loadIsNecessary = hooks.isNecessary?.() ?? shouldLoad(remoteList);

  if (!remoteList || loadIsNecessary) {
    return loadList(dispatch, hooks);
  }

  return new RemoteListFuture({
    ...remoteList,
    items: remoteList.items.filter((item) => !item.deleted),
  });
}

/** @hidden */
export function loadList<
  DataType,
  OnLoadPayload = void,
  OnSuccessPayload = DataType[]
>(
  dispatch: AppDispatch,
  hooks: {
    actionOnError?: (err: unknown) => PayloadAction<unknown>;
    actionOnLoad: () => PayloadAction<OnLoadPayload>;
    actionOnSuccess: (items: DataType[]) => PayloadAction<OnSuccessPayload>;
    loader: () => Promise<DataType[]>;
  }
): IFuture<DataType[]> {
  dispatch(hooks.actionOnLoad());
  const promise = hooks
    .loader()
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

  return new PromiseFuture(promise);
}

/**
 * Used by data fetching hooks to manage cache invalidation and fetching for their entity.
 *
 * A typical call to `loadItemIfNecessary` looks like this one.
 *
 * ```typescript
 * const future = loadItemIfNecessary(submissionItem, dispatch, {
 *   actionOnLoad: () => submissionLoad(submissionId),
 *   actionOnSuccess: (data) => submissionLoaded(data),
 *   loader: () =>
 *     apiClient.get(`/api/orgs/${orgId}/survey_submissions/${submissionId}`),
 * });
 * ```
 *
 * Under the hood, {@link shouldLoad shouldLoad} is used for cache invalidation.
 *
 *
 * @category Cache
 * @param {RemoteItem} remoteItem The remote item to check and load.
 * @param {AppDispatch} dispatch The Redux dispatch function.
 * @param {Object} hooks Callbacks to handle the loading process.
 * @return {IFuture} An {@link IFuture} object that can be used to render a loading spinner or the data itself.
 */
export function loadItemIfNecessary<
  DataType,
  OnLoadPayload = void,
  OnSuccessPayload = DataType
>(
  remoteItem: RemoteItem<DataType> | undefined,
  dispatch: AppDispatch,
  hooks: {
    actionOnLoad: () => PayloadAction<OnLoadPayload>;
    actionOnSuccess: (item: DataType) => PayloadAction<OnSuccessPayload>;
    loader: () => Promise<DataType>;
  }
): IFuture<DataType> {
  if (!remoteItem || shouldLoad(remoteItem)) {
    dispatch(hooks.actionOnLoad());
    const promise = hooks.loader().then((val) => {
      dispatch(hooks.actionOnSuccess(val));
      return val;
    });

    return new PromiseFuture(promise, remoteItem?.data);
  }

  return new RemoteItemFuture(remoteItem);
}
