import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinTag } from 'utils/types/zetkin';
import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';

export interface TagsStoreSlice {
  tagList: RemoteList<ZetkinTag>;
}

const initialState: TagsStoreSlice = {
  tagList: remoteList(),
};

const tagsSlice = createSlice({
  initialState: initialState,
  name: 'tags',
  reducers: {
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
  },
});

export default tagsSlice;
export const { tagLoad, tagLoaded } = tagsSlice.actions;
