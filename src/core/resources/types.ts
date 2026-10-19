import { PayloadAction } from '@reduxjs/toolkit';

import IApiClient from 'core/api/client/IApiClient';
import { RootState } from 'core/store';
import { RemoteList } from 'utils/storeUtils';

export type RemoteListResource<Context, Data> = {
  createConfig: (context: Context) => {
    actionOnError?: (error: unknown) => PayloadAction<unknown>;
    actionOnLoad: () => PayloadAction<unknown>;
    actionOnSuccess: (data: Data[]) => PayloadAction<unknown>;
    cacheKey: string;
    loader: (apiClient: IApiClient) => Promise<Data[]>;
    selector: (state: RootState) => RemoteList<Data> | undefined;
  };
};

export type StreamedResource = {
  key: string;
  resource: Promise<unknown>;
};
