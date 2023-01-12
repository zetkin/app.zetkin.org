import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinView } from './components/types';
import { remoteList, RemoteList } from 'utils/storeUtils';

export interface ViewsStoreSlice {
  viewList: RemoteList<ZetkinView>;
}

const initialState: ViewsStoreSlice = {
  viewList: remoteList(),
};

const viewsSlice = createSlice({
  initialState,
  name: 'views',
  reducers: {
    allViewsLoad: (state) => {
      state.viewList.isLoading = true;
    },
    allViewsLoaded: (state, action: PayloadAction<ZetkinView[]>) => {
      state.viewList = remoteList(action.payload);
      state.viewList.loaded = new Date().toISOString();
    },
  },
});

export default viewsSlice;
export const { allViewsLoad, allViewsLoaded } = viewsSlice.actions;
