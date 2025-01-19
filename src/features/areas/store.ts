import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  remoteItemCreatedWithData,
  remoteItemDeleted,
  remoteItemLoad,
  remoteItemUpdated,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import { ZetkinArea } from './types';
import { ZetkinTag } from 'utils/types/zetkin';

export interface AreasStoreSlice {
  areaList: RemoteList<ZetkinArea>;
  tagsByAreaId: Record<string, RemoteList<ZetkinTag>>;
}

const initialState: AreasStoreSlice = {
  areaList: remoteList(),
  tagsByAreaId: {},
};

const areasSlice = createSlice({
  initialState: initialState,
  name: 'areas',
  reducers: {
    areaCreated: (state, action: PayloadAction<ZetkinArea>) => {
      const area = action.payload;
      remoteItemCreatedWithData(state.areaList, area);
    },
    areaDeleted: (state, action: PayloadAction<string>) => {
      const deletedId = action.payload;
      remoteItemDeleted(state.areaList, deletedId);
    },
    areaLoad: (state, action: PayloadAction<string>) => {
      const areaId = action.payload;
      remoteItemLoad(state.areaList, areaId);
    },
    areaLoaded: (state, action: PayloadAction<ZetkinArea>) => {
      const area = action.payload;
      remoteItemUpdated(state.areaList, area);
    },
    areaUpdated: (state, action: PayloadAction<ZetkinArea>) => {
      const area = action.payload;
      remoteItemUpdated(state.areaList, area);
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
    tagAssigned: (state, action: PayloadAction<[string, ZetkinTag]>) => {
      const [areaId, tag] = action.payload;
      state.tagsByAreaId[areaId] ||= remoteList();

      remoteItemUpdated(state.tagsByAreaId[areaId], tag);

      const areaItem = state.areaList.items.find((item) => item.id == areaId);
      if (areaItem?.data) {
        areaItem.data.tags.push(tag);
      }
    },
    tagUnassigned: (state, action: PayloadAction<[string, number]>) => {
      const [areaId, tagId] = action.payload;
      state.tagsByAreaId[areaId] ||= remoteList();
      state.tagsByAreaId[areaId].items = state.tagsByAreaId[
        areaId
      ].items.filter((item) => item.id != tagId);

      const areaItem = state.areaList.items.find((item) => item.id == areaId);
      if (areaItem?.data) {
        areaItem.data.tags = areaItem.data.tags.filter(
          (tag) => tag.id != tagId
        );
      }
    },
    tagsLoad: (state, action: PayloadAction<string>) => {
      const areaId = action.payload;
      state.tagsByAreaId[areaId] ||= remoteList();
      state.tagsByAreaId[areaId].isLoading = true;
    },
    tagsLoaded: (state, action: PayloadAction<[string, ZetkinTag[]]>) => {
      const [areaId, tags] = action.payload;
      state.tagsByAreaId[areaId] = remoteList(tags);
      state.tagsByAreaId[areaId].loaded = new Date().toISOString();
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
  tagAssigned,
  tagUnassigned,
  tagsLoad,
  tagsLoaded,
} = areasSlice.actions;
