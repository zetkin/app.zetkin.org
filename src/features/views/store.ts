import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ViewTreeItem } from 'pages/api/views/tree';
import { remoteList, RemoteList } from 'utils/storeUtils';
import { ZetkinView, ZetkinViewFolder } from './components/types';

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
    folderUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [id, mutating] = action.payload;
      const item = state.treeList.items.find(
        (item) => item.data?.type == 'folder' && item.data?.data.id == id
      );
      if (item) {
        item.mutating = mutating;
      }
    },
    folderUpdated: (
      state,
      action: PayloadAction<[ZetkinViewFolder, string[]]>
    ) => {
      const [folder, mutating] = action.payload;
      const item = state.treeList.items.find(
        (item) => item.data?.type == 'folder' && item.data?.data.id == folder.id
      );
      if (item) {
        item.mutating = item.mutating.filter(
          (attr) => !mutating.includes(attr)
        );
        if (item.data) {
          item.data.title = folder.title;
        }
      }
    },
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
export const { folderUpdate, folderUpdated, treeLoad, treeLoadded } =
  viewsSlice.actions;
