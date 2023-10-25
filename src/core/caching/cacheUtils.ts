import { AppDispatch } from 'core/store';
import { PayloadAction } from '@reduxjs/toolkit';
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
    actionOnLoad: () => PayloadAction<OnLoadPayload>;
    actionOnSuccess: (items: DataType[]) => PayloadAction<OnSuccessPayload>;
    loader: () => Promise<DataType[]>;
  }
): IFuture<DataType[]> {
  if (!remoteList || shouldLoad(remoteList)) {
    dispatch(hooks.actionOnLoad());
    const promise = hooks.loader().then((val) => {
      dispatch(hooks.actionOnSuccess(val));
      return val;
    });

    return new PromiseFuture(promise);
  }

  return new RemoteListFuture(remoteList);
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
