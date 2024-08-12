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
