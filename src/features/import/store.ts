import {
  Column,
  IMPORT_ERROR,
  ImportedFile,
  PersonImport,
} from './utils/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ImportStoreSlice {
  importErrors: IMPORT_ERROR[];
  importPreview: PersonImport;
  pendingFile: ImportedFile;
}

const initialState: ImportStoreSlice = {
  importErrors: [],
  importPreview: {
    summary: {
      addedToOrg: {
        byOrg: {},
        total: 0,
      },
      created: {
        total: 0,
      },
      tagged: {
        byTag: {},
        total: 0,
      },
      updated: {
        byField: {},
        total: 0,
      },
    },
  },
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
    importErrorsAdd: (state, action: PayloadAction<IMPORT_ERROR[]>) => {
      state.importErrors = action.payload;
    },
    importErrorsClear: (state) => {
      state.importErrors = [];
    },
    importPreviewAdd: (state, action: PayloadAction<PersonImport>) => {
      state.importPreview = action.payload;
    },
    setFirstRowIsHeaders: (state, action: PayloadAction<boolean>) => {
      const sheetIndex = state.pendingFile.selectedSheetIndex;
      state.pendingFile.sheets[sheetIndex].firstRowIsHeaders = action.payload;
    },
    setSelectedSheetIndex: (state, action: PayloadAction<number>) => {
      state.pendingFile.selectedSheetIndex = action.payload;
    },
    updateColumn: (state, action: PayloadAction<[number, Column]>) => {
      const [index, newColumn] = action.payload;
      const sheetIndex = state.pendingFile.selectedSheetIndex;
      state.pendingFile.sheets[sheetIndex].columns[index] = newColumn;
    },
  },
});

export default importSlice;
export const {
  addFile,
  importErrorsAdd,
  importErrorsClear,
  importPreviewAdd,
  setFirstRowIsHeaders,
  setSelectedSheetIndex,
  updateColumn,
} = importSlice.actions;
