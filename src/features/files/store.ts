import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinFile } from 'utils/types/zetkin';
import { remoteList, RemoteList } from 'utils/storeUtils';

export interface FilesStoreSlice {
  fileList: RemoteList<ZetkinFile>;
}

const initialState: FilesStoreSlice = {
  fileList: remoteList(),
};

const filesSlice = createSlice({
  initialState: initialState,
  name: 'tags',
  reducers: {
    filesLoad: (state) => {
      state.fileList.isLoading = true;
    },
    filesLoaded: (state, action: PayloadAction<ZetkinFile[]>) => {
      state.fileList = remoteList(action.payload);
      state.fileList.loaded = new Date().toISOString();
    },
  },
});

export default filesSlice;
export const { filesLoad, filesLoaded } = filesSlice.actions;
