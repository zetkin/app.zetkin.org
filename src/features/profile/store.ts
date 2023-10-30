import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  RemoteItem,
  remoteItem,
  RemoteList,
  remoteList,
} from 'utils/storeUtils';
import { ZetkinCustomField, ZetkinPerson } from 'utils/types/zetkin';

export interface ProfilesStoreSlice {
  fieldsList: RemoteList<ZetkinCustomField>;
  personById: Record<number, RemoteItem<ZetkinPerson>>;
}

const initialState: ProfilesStoreSlice = {
  fieldsList: remoteList(),
  personById: {},
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
  },
});

export default profilesSlice;
export const { fieldsLoad, fieldsLoaded, personLoad, personLoaded } =
  profilesSlice.actions;
