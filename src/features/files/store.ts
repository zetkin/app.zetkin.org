import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinFile } from 'utils/types/zetkin';
import {
  RemoteItem,
  remoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';

export interface FilesStoreSlice {
  fileByFileId: Record<number, RemoteItem<ZetkinFile>>;
  fileList: RemoteList<ZetkinFile>;
}

const initialState: FilesStoreSlice = {
  fileByFileId: {},
  fileList: remoteList(),
};

const filesSlice = createSlice({
  initialState: initialState,
  name: 'files',
  reducers: {
    fileError: (state, action: PayloadAction<[number, unknown]>) => {
      const [fileId, err] = action.payload;
      state.fileByFileId[fileId].isLoading = false;
      state.fileByFileId[fileId].data = null;
      state.fileByFileId[fileId].error = err;
      state.fileByFileId[fileId].loaded = new Date().toISOString();
    },
    fileLoad: (state, action: PayloadAction<[number]>) => {
      const [fileId] = action.payload;
      state.fileByFileId[fileId] = remoteItem(fileId);
      state.fileByFileId[fileId].isLoading = true;
    },
    fileLoaded: (state, action: PayloadAction<ZetkinFile>) => {
      const fileId = action.payload.id;
      state.fileByFileId[fileId].isLoading = false;
      state.fileByFileId[fileId].data = action.payload;
      state.fileByFileId[fileId].loaded = new Date().toISOString();
    },
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
export const {
  fileUploaded,
  filesLoad,
  filesLoaded,
  fileError,
  fileLoad,
  fileLoaded,
} = filesSlice.actions;
