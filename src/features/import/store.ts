import { ImportedFile } from './utils/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ImportStoreSlice {
  pendingFile: ImportedFile;
}

const initialState: ImportStoreSlice = {
  pendingFile: {
    selectedSheetIndex: 0,
    sheets: [],
    title: '',
  },
};

const importSlice = createSlice({
  initialState,
  name: 'import',
  reducers: {
    addFile: (state, action: PayloadAction<ImportedFile>) => {
      const file = action.payload;
      state.pendingFile = file;
    },
    setFirstRowIsHeaders: (state, action: PayloadAction<boolean>) => {
      const sheetIndex = state.pendingFile.selectedSheetIndex;
      state.pendingFile.sheets[sheetIndex].firstRowIsHeaders = action.payload;
    },
    setSelectedColumnIds: (state, action: PayloadAction<number[]>) => {
      const sheetIndex = state.pendingFile.selectedSheetIndex;
      state.pendingFile.sheets[sheetIndex].selectedColumnIds = action.payload;
    },
    setSelectedSheetIndex: (state, action: PayloadAction<number>) => {
      state.pendingFile.selectedSheetIndex = action.payload;
    },
  },
});

export default importSlice;
export const {
  addFile,
  setFirstRowIsHeaders,
  setSelectedColumnIds,
  setSelectedSheetIndex,
} = importSlice.actions;
