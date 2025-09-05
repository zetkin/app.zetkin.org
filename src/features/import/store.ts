import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  Column,
  ImportedFile,
  ImportID,
  ImportPreview,
  PersonImport,
  SheetSettings,
} from './utils/types';

export interface ImportStoreSlice {
  importID: ImportID;
  importResult: PersonImport | null;
  preflightSummary: ImportPreview | null;
  pendingFile: ImportedFile;
}

const initialState: ImportStoreSlice = {
  importID: null,
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
    importIDUpdate: (state, action: PayloadAction<ImportID>) => {
      const newImportID = action.payload;
      state.importID = newImportID;
    },
    importPreviewAdd: (state, action: PayloadAction<ImportPreview>) => {
      state.preflightSummary = action.payload;
    },
    importResultAdd: (state, action: PayloadAction<PersonImport>) => {
      state.importResult = action.payload;
    },
    setSelectedSheetIndex: (state, action: PayloadAction<number>) => {
      state.pendingFile.selectedSheetIndex = action.payload;
    },
    sheetSettingsUpdated: (
      state,
      action: PayloadAction<Partial<SheetSettings>>
    ) => {
      const sheetIndex = state.pendingFile.selectedSheetIndex;
      state.pendingFile.sheets[sheetIndex] = {
        ...state.pendingFile.sheets[sheetIndex],
        ...action.payload,
      };
    },
  },
});

export default importSlice;
export const {
  addFile,
  columnUpdate,
  importIDUpdate,
  importPreviewAdd,
  importResultAdd,
  sheetSettingsUpdated,
  setSelectedSheetIndex,
} = importSlice.actions;
