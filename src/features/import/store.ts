import {
  Column,
  IMPORT_ERROR,
  ImportedFile,
  ImportPreview,
  PersonImport,
} from './utils/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ImportStoreSlice {
  importResult: PersonImport | null;
  importErrors: IMPORT_ERROR[];
  preflightSummary: ImportPreview | null;
  pendingFile: ImportedFile;
}

const initialState: ImportStoreSlice = {
  importErrors: [],
  importResult: null,
  pendingFile: {
    selectedSheetIndex: 0,
    sheets: [],
    title: '',
  },
  preflightSummary: null,
};

const importSlice = createSlice({
  initialState,
  name: 'import',
  reducers: {
    addFile: (state, action: PayloadAction<ImportedFile>) => {
      const file = action.payload;
      state.pendingFile = file;
    },
    columnUpdate: (state, action: PayloadAction<[number, Column]>) => {
      const [index, newColumn] = action.payload;
      const sheetIndex = state.pendingFile.selectedSheetIndex;
      state.pendingFile.sheets[sheetIndex].columns[index] = newColumn;
    },
    importErrorsAdd: (state, action: PayloadAction<IMPORT_ERROR[]>) => {
      state.importErrors = action.payload;
    },
    importPreviewAdd: (state, action: PayloadAction<ImportPreview>) => {
      state.preflightSummary = action.payload;
    },
    importResultAdd: (state, action: PayloadAction<PersonImport>) => {
      state.importResult = action.payload;
    },
    setFirstRowIsHeaders: (state, action: PayloadAction<boolean>) => {
      const sheetIndex = state.pendingFile.selectedSheetIndex;
      state.pendingFile.sheets[sheetIndex].firstRowIsHeaders = action.payload;
    },
    setSelectedSheetIndex: (state, action: PayloadAction<number>) => {
      state.pendingFile.selectedSheetIndex = action.payload;
    },
  },
});

export default importSlice;
export const {
  addFile,
  columnUpdate,
  importErrorsAdd,
  importPreviewAdd,
  importResultAdd,
  setFirstRowIsHeaders,
  setSelectedSheetIndex,
} = importSlice.actions;
