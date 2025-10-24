import { PayloadAction } from '@reduxjs/toolkit';

import { RemoteList } from 'utils/storeUtils';
import useRemoteObject from './useRemoteObject';

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
  useRemoteObject<DataType, OnLoadPayload, OnSuccessPayload>(remoteList, hooks);

  return remoteList?.items
    .filter((item) => !item.deleted)
    .map((item) => item.data)
    .filter((data) => !!data) as DataType[];
}
