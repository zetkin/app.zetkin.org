import { ZetkinOfficial } from 'utils/types/zetkin';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';

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
    accessDeleted: (state, action: PayloadAction<number>) => {
      const officialId = action.payload;
      state.rolesList.items = state.rolesList.items.filter(
        (user) => user.id !== officialId
      );
    },
    adminDemoted: (state, action: PayloadAction<[number, ZetkinOfficial]>) => {
      const [userId, user] = action.payload;
      const item = state.rolesList.items.find((item) => item.id === userId);

      if (item) {
        item.data = { ...item.data, ...user };
        item.mutating = [];
      } else {
        state.rolesList.items.push(remoteItem(userId, { data: user }));
      }
    },
    organizerPromoted: (
      state,
      action: PayloadAction<[number, ZetkinOfficial]>
    ) => {
      const [userId, user] = action.payload;
      const item = state.rolesList.items.find((item) => item.id === userId);

      if (item) {
        item.data = { ...item.data, ...user };
        item.mutating = [];
      } else {
        state.rolesList.items.push(remoteItem(userId, { data: user }));
      }
    },
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
export const {
  accessDeleted,
  adminDemoted,
  organizerPromoted,
  rolesLoaded,
  rolesLoad,
} = RolesSlice.actions;
