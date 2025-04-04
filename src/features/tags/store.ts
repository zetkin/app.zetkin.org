import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  remoteItemDeleted,
  remoteItemLoad,
  remoteItemUpdate,
  remoteItemUpdated,
  remoteList,
  RemoteList,
  remoteListCreated,
  remoteListLoad,
  remoteListLoaded,
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
      state.tagsByPersonId[id] = remoteListLoad(state.tagsByPersonId[id]);
    },
    personTagsLoaded: (state, action: PayloadAction<[number, ZetkinTag[]]>) => {
      const [id, tags] = action.payload;
      state.tagsByPersonId[id] = remoteListLoaded(tags);
    },
    tagAssigned: (state, action: PayloadAction<[number, ZetkinTag]>) => {
      const [personId, tag] = action.payload;
      state.tagsByPersonId[personId] ||= remoteListCreated(
        state.tagsByPersonId[personId]
      );
      remoteItemUpdated(state.tagsByPersonId[personId], tag);
    },
    tagCreate: (state) => {
      // TODO: This is inconsistent with other features. The list itself is not truly loading, just some of the contents
      state.tagList.isLoading;
    },
    tagCreated: (state, action: PayloadAction<ZetkinTag>) => {
      const tag = action.payload;
      state.tagList.isLoading = false;
      remoteItemUpdated(state.tagList, tag);
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
      // TODO: This is inconsistent with other features. The list itself is not truly loading, just some of the contents
      state.tagGroupList.isLoading;
    },
    tagGroupCreated: (state, action: PayloadAction<ZetkinTagGroup>) => {
      const tagGroup = action.payload;
      remoteItemUpdated(state.tagGroupList, tagGroup);
    },
    tagGroupsLoad: (state) => {
      state.tagGroupList = remoteListLoad(state.tagGroupList);
    },
    tagGroupsLoaded: (state, action: PayloadAction<ZetkinTagGroup[]>) => {
      const tagGroups = action.payload;
      state.tagGroupList = remoteListLoaded(tagGroups);
    },
    tagLoad: (state, action: PayloadAction<number>) => {
      const tagId = action.payload;
      remoteItemLoad(state.tagList, tagId);
    },
    tagLoaded: (state, action: PayloadAction<ZetkinTag>) => {
      const tag = action.payload;
      remoteItemUpdated(state.tagList, tag);
    },
    tagUnassigned: (state, action: PayloadAction<[number, number]>) => {
      const [personId, tagId] = action.payload;

      if (!state.tagsByPersonId[personId]) {
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
      state.tagList = remoteListLoad(state.tagList);
    },
    tagsLoaded: (state, action: PayloadAction<ZetkinTag[]>) => {
      const tags = action.payload;
      state.tagList = remoteListLoaded(tags);
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
