import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinTag } from 'utils/types/zetkin';
import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';

export interface TagsStoreSlice {
  tagList: RemoteList<ZetkinTag>;
}

const initialState: TagsStoreSlice = {
  tagList: remoteList(),
};

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */
// TODO: Refactor to use redux fully for tags
// These are just empty for now, but when we refactor, they might
// actually be removed and replaced with tag mappings in the stores
// of taggable objects (like people, journey instances etc).
function doNothing(state: TagsStoreSlice, action: PayloadAction<unknown>) {
  // This does nothing
}
/* eslint-enable */

const tagsSlice = createSlice({
  initialState: initialState,
  name: 'tags',
  reducers: {
    tagAssigned: (state, action: PayloadAction<[number, ZetkinTag]>) => {
      doNothing(state, action);
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
      doNothing(state, action);
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
  tagAssigned,
  tagLoad,
  tagLoaded,
  tagsLoad,
  tagsLoaded,
  tagUnassigned,
} = tagsSlice.actions;
