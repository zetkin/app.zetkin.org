import { ImportedFile } from './utils/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ImportStoreSlice {
  files: ImportedFile[];
}
const initialState: ImportStoreSlice = {
  files: [],
};
const importSlice = createSlice({
  initialState,
  name: 'import',
  reducers: {
    addFiles: (state, action: PayloadAction<ImportedFile>) => {
      const file = action.payload;
      state.files.push(file);
    },
  },
});

export default importSlice;
export const { addFiles } = importSlice.actions;
