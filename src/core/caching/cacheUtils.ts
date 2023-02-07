import { PayloadAction } from '@reduxjs/toolkit';
import shouldLoad from './shouldLoad';
import { Store } from 'core/store';
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
  store: Store,
  hooks: {
    actionOnLoad: () => PayloadAction<OnLoadPayload>;
    actionOnSuccess: (items: DataType[]) => PayloadAction<OnSuccessPayload>;
    loader: () => Promise<DataType[]>;
  }
): IFuture<DataType[]> {
  if (!remoteList || shouldLoad(remoteList)) {
    store.dispatch(hooks.actionOnLoad());
    const promise = hooks.loader().then((val) => {
      store.dispatch(hooks.actionOnSuccess(val));
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
  store: Store,
  hooks: {
    actionOnLoad: () => PayloadAction<OnLoadPayload>;
    actionOnSuccess: (item: DataType) => PayloadAction<OnSuccessPayload>;
    loader: () => Promise<DataType>;
  }
): IFuture<DataType> {
  if (!remoteItem || shouldLoad(remoteItem)) {
    store.dispatch(hooks.actionOnLoad());
    const promise = hooks.loader().then((val) => {
      store.dispatch(hooks.actionOnSuccess(val));
      return val;
    });

    return new PromiseFuture(promise);
  }

  return new RemoteItemFuture(remoteItem);
}
