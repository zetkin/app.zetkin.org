import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  RemoteItem,
  remoteItem,
  RemoteList,
  remoteList,
} from 'utils/storeUtils';
import { ZetkinCustomField, ZetkinPerson, ZetkinTag } from 'utils/types/zetkin';

export interface ProfilesStoreSlice {
  fieldsList: RemoteList<ZetkinCustomField>;
  personById: Record<number, RemoteItem<ZetkinPerson>>;
  tagsByPersonId: Record<number, RemoteList<ZetkinTag>>;
}

const initialState: ProfilesStoreSlice = {
  fieldsList: remoteList(),
  personById: {},
  tagsByPersonId: {},
};

const profilesSlice = createSlice({
  initialState,
  name: 'profiles',
  reducers: {
    fieldsLoad: (state) => {
      state.fieldsList.isLoading = true;
    },
    fieldsLoaded: (state, action: PayloadAction<ZetkinCustomField[]>) => {
      state.fieldsList = remoteList(action.payload);
      state.fieldsList.loaded = new Date().toISOString();
    },
    personLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.personById[id] = remoteItem(id, {
        data: state.personById[id]?.data,
        isLoading: true,
      });
    },
    personLoaded: (state, action: PayloadAction<[number, ZetkinPerson]>) => {
      const [id, data] = action.payload;
      state.personById[id] = remoteItem(id, {
        data,
        loaded: new Date().toISOString(),
      });
    },
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
  },
});

export default profilesSlice;
export const {
  fieldsLoad,
  fieldsLoaded,
  personLoad,
  personLoaded,
  personTagsLoad,
  personTagsLoaded,
} = profilesSlice.actions;
