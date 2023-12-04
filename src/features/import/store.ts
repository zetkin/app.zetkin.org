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
  importErrors: IMPORT_ERROR[];
  importOperations: ZetkinPersonImportOp[];
  importPreview: PersonImport;
  importResult: PersonImport;
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
  importPreview: {
    summary: emptySummary,
  },
  importResult: {
    summary: emptySummary,
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
    columnUpdate: (state, action: PayloadAction<[number, Column]>) => {
      const [index, newColumn] = action.payload;
      const sheetIndex = state.pendingFile.selectedSheetIndex;
      state.pendingFile.sheets[sheetIndex].columns[index] = newColumn;
    },
    importErrorsAdd: (state, action: PayloadAction<IMPORT_ERROR[]>) => {
      state.importErrors = action.payload;
    },
    importErrorsClear: (state) => {
      state.importErrors = [];
    },
    importOperationsAdd: (
      state,
      action: PayloadAction<ZetkinPersonImportOp[]>
    ) => {
      state.importOperations = action.payload;
    },
    importOperationsClear: (state) => {
      state.importOperations = [];
    },
    importPreviewAdd: (state, action: PayloadAction<PersonImport>) => {
      state.importPreview = action.payload;
    },
    importPreviewClear: (state) => {
      state.importPreview = { summary: emptySummary };
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
  importErrorsClear,
  importOperationsAdd,
  importOperationsClear,
  importPreviewAdd,
  importPreviewClear,
  importResultAdd,
  setFirstRowIsHeaders,
  setSelectedSheetIndex,
} = importSlice.actions;
