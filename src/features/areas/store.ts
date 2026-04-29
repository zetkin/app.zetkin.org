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

export interface AreasStoreSlice {
  areasByOrgId: Record<number, RemoteList<Zetkin2Area>>;
  tagsByAreaId: Record<string, RemoteList<ZetkinAppliedTag>>;
}

const initialState: AreasStoreSlice = {
  areasByOrgId: {},
  tagsByAreaId: {},
};

const areasSlice = createSlice({
  initialState: initialState,
  name: 'areas',
  reducers: {
    areaCreated: (state, action: PayloadAction<Zetkin2Area>) => {
      const area = action.payload;
      const orgId = area.organization_id;
      if (!state.areasByOrgId[orgId]) {
        state.areasByOrgId[orgId] = remoteList();
      }
      remoteItemUpdated(state.areasByOrgId[orgId], area);
    },
    areaDeleted: (state, action: PayloadAction<[number, number]>) => {
      const [orgId, deletedId] = action.payload;
      if (state.areasByOrgId[orgId]) {
        remoteItemDeleted(state.areasByOrgId[orgId], deletedId);
      }
    },
    areaLoad: (state, action: PayloadAction<[number, string]>) => {
      const [orgId, areaId] = action.payload;
      if (!state.areasByOrgId[orgId]) {
        state.areasByOrgId[orgId] = remoteList();
      }
      remoteItemLoad(state.areasByOrgId[orgId], areaId);
    },
    areaLoaded: (state, action: PayloadAction<[number, Zetkin2Area]>) => {
      const [orgId, area] = action.payload;
      if (!state.areasByOrgId[orgId]) {
        state.areasByOrgId[orgId] = remoteList();
      }
      remoteItemUpdated(state.areasByOrgId[orgId], area);
    },
    areaUpdated: (state, action: PayloadAction<[number, Zetkin2Area]>) => {
      const [orgId, area] = action.payload;
      if (!state.areasByOrgId[orgId]) {
        state.areasByOrgId[orgId] = remoteList();
      }
      remoteItemUpdated(state.areasByOrgId[orgId], area);
    },
    areasLoad: (state, action: PayloadAction<number>) => {
      const orgId = action.payload;
      state.areasByOrgId[orgId] = remoteListLoad(state.areasByOrgId[orgId]);
    },
    areasLoaded: (state, action: PayloadAction<[number, Zetkin2Area[]]>) => {
      const [orgId, areas] = action.payload;
      state.areasByOrgId[orgId] = remoteListLoaded(areas);
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
} = areasSlice.actions;
