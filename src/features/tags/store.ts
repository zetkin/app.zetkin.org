import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ZetkinTag } from 'types/zetkin';

// TODO: Move to more general-purpose location, e.g. utils
interface ILoadedListItem<DataType> {
  data: DataType;
  id: number;
  loaded: Date;
}

interface ILoadedList<DataType> {
  items: ILoadedListItem<DataType>[];
  loaded: Date | null;
}

interface ITagsSlice {
  tagList: ILoadedList<ZetkinTag>;
  tagsByTypeAndId: {
    person: Record<string, ILoadedList<ZetkinTag>>;
  }
}

const initialState: ITagsSlice = {
  tagList: {
    items: [],
    loaded: null,
  },
  tagsByTypeAndId: {
    person: {},
  },
};

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    tagsResolved: (state, action: PayloadAction<ZetkinTag[]>) => {
      const now = new Date();

      state.tagList.loaded = now;
      state.tagList.items = action.payload.map((tag) => ({
        data: tag,
        id: tag.id,
        loaded: now,
      }));
    },
    // TODO: Support for any object type
    assignedTagsResolved: (state, action: PayloadAction<{ id: number, tags: ZetkinTag[]}>)=> {
        const now = new Date();
        state.tagsByTypeAndId.person[action.payload.id.toString()] = {
            loaded: now,
            items: action.payload.tags.map((tag) => ({
                data: tag,
                id: tag.id,
                loaded: now,
            })),
        }
    }
  },
});

export default tagsSlice.reducer;
export const { assignedTagsResolved, tagsResolved } = tagsSlice.actions;