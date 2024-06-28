import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { BreadcrumbElement } from 'pages/api/breadcrumbs';
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

function isUpdatedAction(action: Action<string>) {
  return action.type.endsWith('Updated');
}

const breadcrumbsSlice = createSlice({
  extraReducers: (builder) => {
    builder.addMatcher(isUpdatedAction, (state) => {
      // In lieu of a general-purpose way of identifying what changed, when
      // anything is updated, we invalidate all breadcrumbs.
      Object.keys(state.crumbsByPath).forEach((path) => {
        state.crumbsByPath[path].isStale = true;
      });
    });
  },
  initialState,
  name: 'breadcrumbs',
  reducers: {
    crumbsLoad: (state, action: PayloadAction<string>) => {
      const path = action.payload;
      state.crumbsByPath[path] = remoteItem(path, {
        data: state.crumbsByPath[path]?.data ?? null,
        isLoading: true,
      });
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
