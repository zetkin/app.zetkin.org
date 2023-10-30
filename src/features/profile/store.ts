import { ZetkinPerson } from 'utils/types/zetkin';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RemoteItem, remoteItem } from 'utils/storeUtils';

export interface ProfilesStoreSlice {
  personById: Record<number, RemoteItem<ZetkinPerson>>;
}

const initialState: ProfilesStoreSlice = {
  personById: {},
};

const profilesSlice = createSlice({
  initialState,
  name: 'profiles',
  reducers: {
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
export const { personLoad, personLoaded } = profilesSlice.actions;
