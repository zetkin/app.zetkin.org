import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { remoteList, RemoteList } from 'utils/storeUtils';
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
    areaLoad: (state, action: PayloadAction<number>) => {
      const areaId = action.payload;
      const item = state.areaList.items.find((item) => item.id == areaId);

      if (item) {
        item.isLoading = true;
      }
    },
    areaLoaded: (state, action: PayloadAction<ZetkinArea>) => {
      const area = action.payload;
      const item = state.areaList.items.find((item) => item.id == area.id);

      if (!item) {
        throw new Error('Finished loading item that never started loading');
      }

      item.data = area;
      item.isLoading = false;
      item.loaded = new Date().toISOString();
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
export const { areaLoad, areaLoaded, areasLoad, areasLoaded } =
  areasSlice.actions;
