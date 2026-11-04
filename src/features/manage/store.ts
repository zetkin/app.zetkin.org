import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { remoteList, RemoteList } from 'utils/storeUtils';
import { ZetkinUser } from 'utils/types/zetkin';

export interface ManageStoreSlice {
  users: RemoteList<ZetkinUser> | undefined;
}

const initialState: ManageStoreSlice = {
  users: undefined,
};

const searchSlice = createSlice({
  initialState,
  name: 'manage',
  reducers: {
    usersError: (state, action: PayloadAction<string>) => {
      const serializedError = action.payload;
      state.users = remoteList();
      state.users.error = serializedError;
      state.users.loaded = new Date().toISOString();
    },
    usersLoad: (state) => {
      state.users = remoteList();
    },
    usersLoaded: (state, action: PayloadAction<ZetkinUser[]>) => {
      const users = action.payload;
      state.users = remoteList(users);
      state.users.loaded = new Date().toISOString();
    },
  },
});

export default searchSlice;
export const { usersError, usersLoad, usersLoaded } = searchSlice.actions;
