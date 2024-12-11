import { PayloadAction } from '@reduxjs/toolkit';

import shouldLoad from 'core/caching/shouldLoad';
import { RemoteList } from 'utils/storeUtils';
import { useAppDispatch } from '.';

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
    isNecessary?: () => boolean;
    loader: () => Promise<DataType[]>;
  }
): DataType[] {
  const dispatch = useAppDispatch();
  const loadIsNecessary = hooks.isNecessary?.() ?? shouldLoad(remoteList);

  if (!remoteList || loadIsNecessary) {
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

    throw promise;
  }

  return remoteList.items
    .filter((item) => !item.deleted)
    .map((item) => item.data)
    .filter((data) => !!data) as DataType[];
}
