import { ImportedFile } from './utils/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ImportStoreSlice {
  firstRowIsHeaders: boolean;
  pendingFile: ImportedFile;
  selectedColumnIds: number[];
  selectedSheetIndex: number;
}

const initialState: ImportStoreSlice = {
  firstRowIsHeaders: true,
  pendingFile: { sheets: [], title: '' },
  selectedColumnIds: [],
  selectedSheetIndex: 0,
};

const importSlice = createSlice({
  initialState,
  name: 'import',
  reducers: {
    addFile: (state, action: PayloadAction<ImportedFile>) => {
      const file = action.payload;
      state.pendingFile = file;
    },
    setFirstRowIsHeaders: (state) => {
      state.firstRowIsHeaders = !state.firstRowIsHeaders;
    },
    setSelectedColumnIds: (state, action: PayloadAction<number[]>) => {
      state.selectedColumnIds = action.payload;
    },
    setSelectedSheetIndex: (state, action: PayloadAction<number>) => {
      state.selectedSheetIndex = action.payload;
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
