import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  remoteItemDeleted,
  remoteItemLoad,
  remoteItemUpdated,
  remoteList,
  RemoteList,
  remoteListCreated,
  remoteListLoad,
  remoteListLoaded,
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
      remoteItemUpdated(state.areaList, area);
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
      state.areaList = remoteListLoad(state.areaList);
    },
    areasLoaded: (state, action: PayloadAction<ZetkinArea[]>) => {
      const areas = action.payload;
      state.areaList = remoteListLoaded(areas);
    },
    tagAssigned: (state, action: PayloadAction<[string, ZetkinTag]>) => {
      const [areaId, tag] = action.payload;

      state.tagsByAreaId[areaId] ||= remoteListCreated(
        state.tagsByAreaId[areaId]
      );
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
      state.tagsByAreaId[areaId] = remoteListLoad(state.tagsByAreaId[areaId]);
    },
    tagsLoaded: (state, action: PayloadAction<[string, ZetkinTag[]]>) => {
      const [areaId, tags] = action.payload;
      state.tagsByAreaId[areaId] = remoteListLoaded(tags);
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
