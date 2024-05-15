import { ZetkinOfficial } from 'utils/types/zetkin';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { remoteList, RemoteList } from 'utils/storeUtils';

export interface RolesStoreSlice {
  rolesList: RemoteList<ZetkinOfficial>;
}

const initialState: RolesStoreSlice = {
  rolesList: remoteList(),
};

const RolesSlice = createSlice({
  initialState,
  name: 'roles',
  reducers: {
    rolesLoad: (state) => {
      state.rolesList.isLoading = true;
    },
    rolesLoaded: (state, action: PayloadAction<ZetkinOfficial[]>) => {
      const roles = action.payload;

      state.rolesList = remoteList(roles);
      state.rolesList.loaded = new Date().toISOString();
      state.rolesList.isLoading = false;
    },
  },
});

export default RolesSlice;
export const { rolesLoaded, rolesLoad } = RolesSlice.actions;
