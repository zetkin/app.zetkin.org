import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';
import { ZetkinArea } from './types';

export interface AreasStoreSlice {
  areaList: RemoteList<ZetkinArea>;
}

const initialState: AreasStoreSlice = {
  areaList: remoteList(),
};

const areasSlice = createSlice({
  initialState: initialState,
  name: 'areas',
  reducers: {
    areaCreated: (state, action: PayloadAction<ZetkinArea>) => {
      const area = action.payload;
      const item = remoteItem(area.id, {
        data: area,
        loaded: new Date().toISOString(),
      });

      state.areaList.items.push(item);
    },
    areasLoad: (state) => {
      state.areaList.isLoading = true;
    },
    areasLoaded: (state, action: PayloadAction<ZetkinArea[]>) => {
      const timestamp = new Date().toISOString();
      const areas = action.payload;
      state.areaList = remoteList(areas);
      state.areaList.loaded = timestamp;
      state.areaList.items.forEach((item) => (item.loaded = timestamp));
    },
  },
});

export default areasSlice;
export const { areaCreated, areasLoad, areasLoaded } = areasSlice.actions;
