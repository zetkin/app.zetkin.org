import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  remoteItem,
  RemoteItem,
  remoteItemDeleted,
  remoteItemLoad,
  remoteItemUpdated,
  remoteList,
  RemoteList,
  remoteListLoad,
  remoteListLoaded,
} from 'utils/storeUtils';
import { Zetkin2Area, ZetkinAreaStats } from './types';
import { ZetkinAppliedTag } from 'utils/types/zetkin';

export interface AreasStoreSlice {
  areaList: RemoteList<Zetkin2Area>;
  assignmentStatsByAreaId: Record<number, RemoteItem<ZetkinAreaStats>>;
  tagsByAreaId: Record<string, RemoteList<ZetkinAppliedTag>>;
}

const initialState: AreasStoreSlice = {
  areaList: remoteList(),
  assignmentStatsByAreaId: {},
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
    assignmentStatsLoad: (state, action: PayloadAction<number>) => {
      const areaId = action.payload;

      if (!state.assignmentStatsByAreaId[areaId]) {
        state.assignmentStatsByAreaId[areaId] = remoteItem(areaId);
      }

      state.assignmentStatsByAreaId[areaId].isLoading = true;
    },
    assignmentStatsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinAreaStats | null]>
    ) => {
      const [areaId, assignmentStats] = action.payload;

      state.assignmentStatsByAreaId[areaId] = remoteItem(areaId, {
        data: assignmentStats,
        isLoading: false,
        isStale: false,
        loaded: new Date().toISOString(),
      });
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
  assignmentStatsLoad,
  assignmentStatsLoaded,
} = areasSlice.actions;
