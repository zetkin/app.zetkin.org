import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  findOrAddItem,
  remoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import { ZetkinArea, ZetkinPlace } from './types';

export interface AreasStoreSlice {
  areaList: RemoteList<ZetkinArea>;
  placeList: RemoteList<ZetkinPlace>;
}

const initialState: AreasStoreSlice = {
  areaList: remoteList(),
  placeList: remoteList(),
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
    areaDeleted: (state, action: PayloadAction<string>) => {
      const deletedId = action.payload;
      state.areaList.items = state.areaList.items.filter(
        (item) => item.id != deletedId
      );
    },
    areaLoad: (state, action: PayloadAction<string>) => {
      const areaId = action.payload;
      const item = state.areaList.items.find((item) => item.id == areaId);

      if (item) {
        item.isLoading = true;
      } else {
        state.areaList.items = state.areaList.items.concat([
          remoteItem(areaId, { isLoading: true }),
        ]);
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
    areaUpdated: (state, action: PayloadAction<ZetkinArea>) => {
      const area = action.payload;
      const item = findOrAddItem(state.areaList, area.id);

      item.data = area;
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
    placeCreated: (state, action: PayloadAction<ZetkinPlace>) => {
      const place = action.payload;
      const item = remoteItem(place.id, {
        data: place,
        loaded: new Date().toISOString(),
      });

      state.placeList.items.push(item);
    },
    placesLoad: (state) => {
      state.placeList.isLoading = true;
    },
    placesLoaded: (state, action: PayloadAction<ZetkinPlace[]>) => {
      const timestamp = new Date().toISOString();
      const places = action.payload;
      state.placeList = remoteList(places);
      state.placeList.loaded = timestamp;
      state.placeList.items.forEach((item) => (item.loaded = timestamp));
    },
  },
});

export default areasSlice;
export const {
  areaCreated,
  areaDeleted,
  areaLoad,
  areaLoaded,
  areasLoad,
  areasLoaded,
  areaUpdated,
  placeCreated,
  placesLoad,
  placesLoaded,
} = areasSlice.actions;
