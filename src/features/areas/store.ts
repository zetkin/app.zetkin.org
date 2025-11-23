import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  remoteItemDeleted,
  remoteItemLoad,
  remoteItemUpdated,
  remoteList,
  RemoteList,
  remoteListLoad,
  remoteListLoaded,
} from 'utils/storeUtils';
import { Zetkin2Area } from './types';
import { ZetkinAppliedTag } from 'utils/types/zetkin';
import { ZetkinLocation } from 'features/areaAssignments/types';

export interface AreasStoreSlice {
  areaList: RemoteList<Zetkin2Area>;
  locationsByAreaId: Record<string, RemoteList<ZetkinLocation>>;
  tagsByAreaId: Record<string, RemoteList<ZetkinAppliedTag>>;
}

const initialState: AreasStoreSlice = {
  areaList: remoteList(),
  locationsByAreaId: {},
  tagsByAreaId: {},
};

const areasSlice = createSlice({
  initialState: initialState,
  name: 'areas',
  reducers: {
    areaCreated: (state, action: PayloadAction<Zetkin2Area>) => {
      const area = action.payload;
      remoteItemUpdated(state.areaList, area);
    },
    areaDeleted: (state, action: PayloadAction<number>) => {
      const deletedId = action.payload;
      remoteItemDeleted(state.areaList, deletedId);
    },
    areaLoad: (state, action: PayloadAction<string>) => {
      const areaId = action.payload;
      remoteItemLoad(state.areaList, areaId);
    },
    areaLoaded: (state, action: PayloadAction<Zetkin2Area>) => {
      const area = action.payload;
      remoteItemUpdated(state.areaList, area);
    },
    areaUpdated: (state, action: PayloadAction<Zetkin2Area>) => {
      const area = action.payload;
      remoteItemUpdated(state.areaList, area);
    },
    areasLoad: (state) => {
      state.areaList = remoteListLoad(state.areaList);
    },
    areasLoaded: (state, action: PayloadAction<Zetkin2Area[]>) => {
      const areas = action.payload;
      state.areaList = remoteListLoaded(areas);
    },
    locationsLoad: (state, action) => {
      const key = action.payload;

      state.locationsByAreaId[key] = remoteListLoad(
        state.locationsByAreaId[key]
      );
    },
    locationsLoaded: (
      state,
      action: PayloadAction<[string, ZetkinLocation[]]>
    ) => {
      const [key, locations] = action.payload;

      state.locationsByAreaId[key] = remoteListLoaded(locations);
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
  locationsLoad,
  locationsLoaded,
  areaUpdated,
} = areasSlice.actions;
