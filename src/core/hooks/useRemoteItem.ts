import { PayloadAction } from '@reduxjs/toolkit';

import shouldLoad from 'core/caching/shouldLoad';
import { RemoteItem } from 'utils/storeUtils';
import { useAppDispatch } from '.';

export default function useRemoteItem<
  DataType,
  OnLoadPayload = void,
  OnSuccessPayload = DataType
>(
  remoteItem: RemoteItem<DataType> | undefined | null,
  hooks: {
    actionOnError?: (err: unknown) => PayloadAction<unknown>;
    actionOnLoad: () => PayloadAction<OnLoadPayload>;
    actionOnSuccess: (items: DataType) => PayloadAction<OnSuccessPayload>;
    isNecessary?: () => boolean;
    loader: () => Promise<DataType>;
  }
): DataType {
  const dispatch = useAppDispatch();
  const loadIsNecessary = hooks.isNecessary?.() ?? shouldLoad(remoteItem);

  if (loadIsNecessary) {
    dispatch(hooks.actionOnLoad());

    const promise = hooks
      .loader()
      .then((data) => {
        dispatch(hooks.actionOnSuccess(data));
      })
      .catch((err) => {
        if (hooks.actionOnError) {
          dispatch(hooks.actionOnError(err));
        }
      });

    if (remoteItem?.data) {
      return remoteItem.data;
    } else {
      throw promise;
    }
  }

  if (!remoteItem?.data) {
    throw new Error('Item not loading or loaded');
  }

  return remoteItem.data;
}
