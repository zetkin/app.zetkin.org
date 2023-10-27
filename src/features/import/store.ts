import { createSlice } from '@reduxjs/toolkit';
import { RemoteList, remoteList } from 'utils/storeUtils';

export interface ImportStoreSlice {
  testList: RemoteList<{ id: string }>;
}
const initialState: ImportStoreSlice = {
  testList: remoteList(),
};
const importSlice = createSlice({
  initialState,
  name: 'import',
  reducers: {
    //TODO add actions
  },
});

export default importSlice;
