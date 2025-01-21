import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  remoteItemCreatedWithData,
  remoteItemDeleted,
  remoteItemLoad,
  remoteItemLoaded,
  remoteItemUpdate,
  remoteItemUpdated,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import { ZetkinTag, ZetkinTagGroup } from 'utils/types/zetkin';

export interface TagsStoreSlice {
  tagGroupList: RemoteList<ZetkinTagGroup>;
  tagList: RemoteList<ZetkinTag>;
  tagsByPersonId: Record<number, RemoteList<ZetkinTag>>;
}

const initialState: TagsStoreSlice = {
  tagGroupList: remoteList(),
  tagList: remoteList(),
  tagsByPersonId: {},
};

const tagsSlice = createSlice({
  initialState: initialState,
  name: 'tags',
  reducers: {
    personTagsLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (!state.tagsByPersonId[id]) {
        state.tagsByPersonId[id] = remoteList();
      }
      state.tagsByPersonId[id].isLoading = true;
    },
    personTagsLoaded: (state, action: PayloadAction<[number, ZetkinTag[]]>) => {
      const [id, tags] = action.payload;
      state.tagsByPersonId[id] = remoteList(tags);
      state.tagsByPersonId[id].loaded = new Date().toISOString();
    },
    tagAssigned: (state, action: PayloadAction<[number, ZetkinTag]>) => {
      const [personId, tag] = action.payload;
      if (!state.tagsByPersonId[personId]) {
        state.tagsByPersonId[personId] = remoteList();
      }
      remoteItemUpdated(state.tagsByPersonId[personId], tag);
    },
    tagCreate: (state) => {
      state.tagList.isLoading;
    },
    tagCreated: (state, action: PayloadAction<ZetkinTag>) => {
      const tag = action.payload;
      remoteItemCreatedWithData(state.tagList, tag);
    },
    tagDeleted: (state, action: PayloadAction<number>) => {
      const tagId = action.payload;

      remoteItemDeleted(state.tagList, tagId);

      for (const personId in state.tagsByPersonId) {
        state.tagsByPersonId[personId].items = state.tagsByPersonId[
          personId
        ].items.filter((item) => item.id != tagId);
      }
    },
    tagGroupCreate: (state) => {
      state.tagGroupList.isLoading;
    },
    tagGroupCreated: (state, action: PayloadAction<ZetkinTagGroup>) => {
      const tagGroup = action.payload;
      remoteItemCreatedWithData(state.tagGroupList, tagGroup);
    },
    tagGroupsLoad: (state) => {
      state.tagGroupList.isLoading = true;
    },
    tagGroupsLoaded: (state, action: PayloadAction<ZetkinTagGroup[]>) => {
      const tagGroups = action.payload;
      const timestamp = new Date().toISOString();

      state.tagGroupList = remoteList(tagGroups);
      state.tagGroupList.loaded = timestamp;
      state.tagGroupList.items.forEach((item) => (item.loaded = timestamp));
    },
    tagLoad: (state, action: PayloadAction<number>) => {
      const tagId = action.payload;
      remoteItemLoad(state.tagList, tagId);
    },
    tagLoaded: (state, action: PayloadAction<ZetkinTag>) => {
      const tag = action.payload;
      remoteItemLoaded(state.tagList, tag);
    },
    tagUnassigned: (state, action: PayloadAction<[number, number]>) => {
      const [personId, tagId] = action.payload;
      const tagsByPersonId = state.tagsByPersonId[personId];

      if (!tagsByPersonId) {
        return;
      }

      remoteItemDeleted(state.tagsByPersonId[personId], tagId);
    },
    tagUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [tagId, mutating] = action.payload;
      remoteItemUpdate(state.tagList, tagId, mutating);
    },
    tagUpdated: (state, action: PayloadAction<ZetkinTag>) => {
      const tag = action.payload;
      remoteItemUpdated(state.tagList, tag);

      // Update tags on people
      Object.values(state.tagsByPersonId).forEach((tagList) => {
        tagList.items.forEach((item) => {
          if (item.id == tag.id) {
            item.data = { ...tag, value: item.data?.value };
          }
        });
      });
    },
    tagsLoad: (state) => {
      state.tagList.isLoading = true;
    },
    tagsLoaded: (state, action: PayloadAction<ZetkinTag[]>) => {
      const tags = action.payload;
      const timestamp = new Date().toISOString();

      state.tagList = remoteList(tags);
      state.tagList.loaded = timestamp;
      state.tagList.items.forEach((item) => (item.loaded = timestamp));
    },
  },
});

export default tagsSlice;
export const {
  personTagsLoad,
  personTagsLoaded,
  tagAssigned,
  tagCreate,
  tagCreated,
  tagDeleted,
  tagGroupCreate,
  tagGroupCreated,
  tagGroupsLoad,
  tagGroupsLoaded,
  tagLoad,
  tagLoaded,
  tagsLoad,
  tagsLoaded,
  tagUnassigned,
  tagUpdate,
  tagUpdated,
} = tagsSlice.actions;
