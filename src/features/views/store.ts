import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ViewTreeItem } from 'pages/api/views/tree';
import { ZetkinView } from './components/types';
import { remoteList, RemoteList } from 'utils/storeUtils';

export interface ViewsStoreSlice {
  treeList: RemoteList<ViewTreeItem>;
  viewList: RemoteList<ZetkinView>;
}

const initialState: ViewsStoreSlice = {
  treeList: remoteList(),
  viewList: remoteList(),
};

const viewsSlice = createSlice({
  initialState,
  name: 'views',
  reducers: {
    treeLoad: (state) => {
      state.treeList.isLoading = true;
    },
    treeLoadded: (state, action: PayloadAction<ViewTreeItem[]>) => {
      state.treeList = remoteList(action.payload);
      state.treeList.loaded = new Date().toISOString();
    },
  },
});

export default viewsSlice;
export const { treeLoad, treeLoadded } = viewsSlice.actions;
