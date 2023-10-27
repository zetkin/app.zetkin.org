import { createSlice } from '@reduxjs/toolkit';

export interface ImportStoreSlice {
  //TODO add interface
}
const initialState: ImportStoreSlice = {
  //TODO add list
};
const importSlice = createSlice({
  initialState,
  name: 'import',
  reducers: {
    //TODO add actions
  },
});

export default importSlice;
export const {
  //TODO add actions
} = importSlice.actions;
