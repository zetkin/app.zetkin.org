import { ZetkinPersonImportOp } from './utils/prepareImportOperations';
import {
  Column,
  IMPORT_ERROR,
  ImportedFile,
  PersonImport,
  PersonImportSummary,
} from './utils/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ImportStoreSlice {
  importResult: PersonImport;
  importErrors: IMPORT_ERROR[];
  importOperations: ZetkinPersonImportOp[];
  preflightSummary: PersonImportSummary;
  pendingFile: ImportedFile;
}

const emptySummary: PersonImportSummary = {
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
};

const initialState: ImportStoreSlice = {
  importErrors: [],
  importOperations: [],
  importResult: {
    accepted: '',
    completed: null,
    report: {
      person: {
        summary: emptySummary,
      },
    },
    status: null,
  },
  pendingFile: {
    selectedSheetIndex: 0,
    sheets: [],
    title: '',
  },
  preflightSummary: emptySummary,
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
    importPreviewAdd: (state, action: PayloadAction<PersonImportSummary>) => {
      state.preflightSummary = action.payload;
    },
    importPreviewClear: (state) => {
      state.preflightSummary = emptySummary;
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
  importPreviewClear,
  importResultAdd,
  setFirstRowIsHeaders,
  setSelectedSheetIndex,
} = importSlice.actions;
