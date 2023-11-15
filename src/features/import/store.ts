import range from 'utils/range';
import { Column, ConfiguringData, ImportedFile } from './utils/types';
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
    createColumns: (state) => {
      const sheet =
        state.pendingFile.sheets[state.pendingFile.selectedSheetIndex];
      const rows = sheet.rows;

      const numberOfColumns = rows.length > 0 ? rows[0].data.length : 0;

      const allColumns: Column[] = [];
      range(numberOfColumns).forEach((number) =>
        allColumns.push({
          data: [],
          id: number + 1,
          selected: false,
          title: '',
        })
      );

      rows?.forEach((row, rowIndex) => {
        row.data.forEach((cellValue, cellIndex) => {
          const column = allColumns[cellIndex];
          if (rowIndex == 0) {
            if (sheet.firstRowIsHeaders && cellValue !== null) {
              column.title = cellValue as string;
            } else {
              column.title = 'Test ' + cellIndex + 1;
              /* messages.configuration.mapping.defaultColumnHeader(
                {
                  columnIndex: cellIndex + 1,
                }
              ); */
              column.data.push(cellValue);
            }
          } else {
            column.data.push(cellValue);
          }
        });
      });
      state.pendingFile.sheets[state.pendingFile.selectedSheetIndex].columns =
        allColumns;
    },
    setColumnSelected: (state, action: PayloadAction<number>) => {
      const columnId = action.payload;
      const columns =
        state.pendingFile.sheets[state.pendingFile.selectedSheetIndex].columns;

      const column = columns.find((c) => c.id == columnId);

      if (column) {
        column.selected = !column.selected;
      }
    },
    setCurrentlyConfiguring: (
      state,
      action: PayloadAction<ConfiguringData>
    ) => {
      const configuring = action.payload;
      state.pendingFile.sheets[
        state.pendingFile.selectedSheetIndex
      ].currentlyConfiguring = configuring;
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
  createColumns,
  setColumnSelected,
  setCurrentlyConfiguring,
  setFirstRowIsHeaders,
  setSelectedSheetIndex,
} = importSlice.actions;
