import { BreadcrumbElement } from 'pages/api/breadcrumbs';
import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { remoteItem, RemoteItem } from 'utils/storeUtils';

type BreadcrumbItem = {
  elements: BreadcrumbElement[];
  id: string;
};

export interface BreadcrumbsStoreSlice {
  crumbsByPath: Record<string, Record<string, RemoteItem<BreadcrumbItem>>>;
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
        Object.keys(state.crumbsByPath[path]).forEach((query) => {
          state.crumbsByPath[path][query].isStale = true;
        });
      });
    });
  },
  initialState,
  name: 'breadcrumbs',
  reducers: {
    crumbsLoad: (
      state,
      action: PayloadAction<{ path: string; query: string }>
    ) => {
      const { path, query } = action.payload;
      if (!state.crumbsByPath[path]) {
        state.crumbsByPath[path] = {};
      }
      state.crumbsByPath[path][query] = remoteItem(path, {
        isLoading: true,
      });
    },
    crumbsLoaded: (
      state,
      action: PayloadAction<[{ path: string; query: string }, BreadcrumbItem]>
    ) => {
      const [{ path, query }, loadedItem] = action.payload;
      if (!state.crumbsByPath[path]) {
        state.crumbsByPath[path] = {};
      }
      state.crumbsByPath[path][query] = remoteItem<BreadcrumbItem>(path, {
        data: loadedItem,
        loaded: new Date().toISOString(),
      });
    },
  },
});

export default breadcrumbsSlice;
export const { crumbsLoad, crumbsLoaded } = breadcrumbsSlice.actions;
