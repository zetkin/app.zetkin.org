import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  findOrAddItem,
  remoteItem,
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
    tagAssigned: (state, action: PayloadAction<[string, ZetkinTag]>) => {
      const [areaId, tag] = action.payload;
      state.tagsByAreaId[areaId] ||= remoteList();
      const tagItem = findOrAddItem(state.tagsByAreaId[areaId], tag.id);
      tagItem.data = tag;
      tagItem.loaded = new Date().toISOString();

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
