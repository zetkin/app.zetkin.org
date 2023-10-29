import { BreadcrumbElement } from 'pages/api/breadcrumbs';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { remoteItem, RemoteItem } from 'utils/storeUtils';

type BreadcrumbItem = {
  elements: BreadcrumbElement[];
  id: string;
};

export interface BreadcrumbsStoreSlice {
  crumbsByPath: Record<string, RemoteItem<BreadcrumbItem>>;
}

const initialState: BreadcrumbsStoreSlice = {
  crumbsByPath: {},
};

const breadcrumbsSlice = createSlice({
  initialState,
  name: 'breadcrumbs',
  reducers: {
    crumbsLoad: (state, action: PayloadAction<string>) => {
      const path = action.payload;
      state.crumbsByPath[path] = remoteItem(path, { isLoading: true });
    },
    crumbsLoaded: (state, action: PayloadAction<[string, BreadcrumbItem]>) => {
      const [path, loadedItem] = action.payload;
      state.crumbsByPath[path] = remoteItem<BreadcrumbItem>(path, {
        data: loadedItem,
        loaded: new Date().toISOString(),
      });
    },
  },
});

export default breadcrumbsSlice;
export const { crumbsLoad, crumbsLoaded } = breadcrumbsSlice.actions;
