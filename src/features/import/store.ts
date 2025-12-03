import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  Column,
  ColumnKind,
  ImportedFile,
  ImportID,
  ImportPreview,
  PersonImport,
  SheetSettings,
} from './types';

export interface ImportStoreSlice {
  importResult: PersonImport | null;
  preflightSummary: ImportPreview | null;
  pendingFile: ImportedFile;
}

const initialState: ImportStoreSlice = {
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
      const currentColumn = state.pendingFile.sheets[sheetIndex].columns[index];

      const currentColumnIsImportID =
        currentColumn.kind == ColumnKind.ID_FIELD &&
        state.pendingFile.sheets[sheetIndex].importID == currentColumn.idField;

      if (currentColumnIsImportID) {
        state.pendingFile.sheets[sheetIndex].importID = null;
      }

      state.pendingFile.sheets[sheetIndex].columns[index] = newColumn;
    },
    importIDUpdate: (state, action: PayloadAction<ImportID | null>) => {
      const newImportID = action.payload;
      const sheetIndex = state.pendingFile.selectedSheetIndex;

      const currentImportIDIsZetkinID =
        state.pendingFile.sheets[sheetIndex].importID == 'id';

      //If changing import ID from Zetkin ID,
      //deselect column that was Zetkin IDs
      if (currentImportIDIsZetkinID && newImportID != 'id') {
        const sheetIndex = state.pendingFile.selectedSheetIndex;
        const sheet = state.pendingFile.sheets[sheetIndex];

        const indexOfIdColumn = sheet.columns.findIndex(
          (col) => col.kind == ColumnKind.ID_FIELD && col.idField == 'id'
        );

        state.pendingFile.sheets[sheetIndex].columns[indexOfIdColumn] = {
          kind: ColumnKind.UNKNOWN,
          selected: false,
        };
      }

      state.pendingFile.sheets[sheetIndex].importID = newImportID;
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
