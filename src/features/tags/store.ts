import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';
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
      state.tagsByPersonId[personId].items.push(
        remoteItem(tag.id, { data: tag })
      );
    },
    tagCreate: (state) => {
      state.tagList.isLoading;
    },
    tagCreated: (state, action: PayloadAction<ZetkinTag>) => {
      const tag = action.payload;
      state.tagList.isLoading = false;
      state.tagList.items.push(remoteItem(tag.id, { data: tag }));
    },
    tagDeleted: (state, action: PayloadAction<number>) => {
      const tagId = action.payload;
      const tagListItem = state.tagList.items.find((item) => item.id === tagId);

      if (tagListItem) {
        tagListItem.deleted = true;
      }

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
      state.tagGroupList.isLoading = false;
      state.tagGroupList.items.push(
        remoteItem(tagGroup.id, { data: tagGroup })
      );
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
      const item = state.tagList.items.find((item) => item.id == tagId);
      if (item) {
        item.isLoading = true;
      } else {
        state.tagList.items = state.tagList.items.concat([
          remoteItem(tagId, { isLoading: true }),
        ]);
      }
    },
    tagLoaded: (state, action: PayloadAction<ZetkinTag>) => {
      const tag = action.payload;
      state.tagList.items = state.tagList.items
        .filter((item) => item.id != tag.id)
        .concat([
          remoteItem(tag.id, { data: tag, loaded: new Date().toISOString() }),
        ]);
    },
    tagUnassigned: (state, action: PayloadAction<[number, number]>) => {
      const [personId, tagId] = action.payload;
      state.tagsByPersonId[personId].items = state.tagsByPersonId[
        personId
      ].items.filter((item) => item.id != tagId);
    },
    tagUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [tagId, mutating] = action.payload;
      const item = state.tagList.items.find((tag) => tag.id === tagId);
      if (item) {
        item.mutating = mutating;
      }
    },
    tagUpdated: (state, action: PayloadAction<ZetkinTag>) => {
      const tag = action.payload;
      const item = state.tagList.items.find((item) => item.id == tag.id);
      if (item) {
        item.data = { ...item.data, ...tag };
        item.mutating = [];
      }

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
