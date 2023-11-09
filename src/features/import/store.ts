import { ImportedFile } from './utils/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ImportStoreSlice {
  pendingFile: ImportedFile;
}

const initialState: ImportStoreSlice = {
  pendingFile: { sheets: [], title: '' },
};

const importSlice = createSlice({
  initialState,
  name: 'import',
  reducers: {
    addFile: (state, action: PayloadAction<ImportedFile>) => {
      const file = action.payload;
      state.pendingFile = file;
    },
  },
});

export default importSlice;
export const { addFile } = importSlice.actions;
