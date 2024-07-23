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
    /**
     * Called when an error occurs while loading the list.
     * @param err The error that occurred during the loading process.
     * @return {PayloadAction} The action to dispatch when an error occurs.
     */
    actionOnError?: (err: unknown) => PayloadAction<unknown>;

    /**
     * Called when the list begins loading.
     * @returns {PayloadAction} The action to dispatch when the list is loading.
     */
    actionOnLoad: () => PayloadAction<OnLoadPayload>;

    /**
     * Called when the list loads successfully.
     * @returns {PayloadAction} The action to dispatch when the list has loaded.
     */
    actionOnSuccess: (items: DataType[]) => PayloadAction<OnSuccessPayload>;

    /**
     * Optionally override {@link shouldLoad shouldLoad} with a custom function.
     * @returns {boolean} Whether the list should be loaded.
     */
    isNecessary?: () => boolean;

    /**
     * The function that loads the list. Typically an API call.
     * @returns {Promise<DataType[]>}
     */
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
    /**
     * Called when the item begins loading.
     * @returns {PayloadAction} The action to dispatch when the item is loading.
     */
    actionOnLoad: () => PayloadAction<OnLoadPayload>;

    /**
     * Called when the item loads successfully.
     * @returns {PayloadAction} The action to dispatch when the item has loaded.
     */
    actionOnSuccess: (item: DataType) => PayloadAction<OnSuccessPayload>;

    /**
     * The function that loads the item. Typically an API call.
     * @returns {Promise<DataType[]>}
     */
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
