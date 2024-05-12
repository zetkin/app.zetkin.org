import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinFile } from 'utils/types/zetkin';
import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';

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
    fileUploaded: (state, action: PayloadAction<ZetkinFile>) => {
      const file = action.payload;
      state.fileList.items = state.fileList.items.concat([
        remoteItem(file.id, { data: file, loaded: new Date().toISOString() }),
      ]);
    },
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
export const { fileUploaded, filesLoad, filesLoaded } = filesSlice.actions;
