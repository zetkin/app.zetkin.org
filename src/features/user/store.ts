import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  RemoteItem,
  remoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import { ZetkinMembership, ZetkinUser } from 'utils/types/zetkin';
import { ZetkinOrgUser } from './types';
import { findOrAddItem } from 'utils/storeUtils/findOrAddItem';

export interface UserStoreSlice {
  membershipList: RemoteList<ZetkinMembership & { id: number }>;
  orgUserList: RemoteList<ZetkinOrgUser>;
  userItem: RemoteItem<ZetkinUser>;
}

const initialState: UserStoreSlice = {
  membershipList: remoteList(),
  orgUserList: remoteList(),
  userItem: remoteItem('me'),
};

const userSlice = createSlice({
  initialState: initialState,
  name: 'user',
  reducers: {
    membershipsLoad: (state) => {
      state.membershipList.isLoading = true;
    },
    membershipsLoaded: (state, action: PayloadAction<ZetkinMembership[]>) => {
      state.membershipList = remoteList(
        action.payload.map((membership) => ({
          ...membership,
          id: membership.organization.id,
        }))
      );
      state.membershipList.loaded = new Date().toISOString();
    },
    orgUserLoad: (state, action: PayloadAction<number>) => {
      const userId = action.payload;
      const item = findOrAddItem(state.orgUserList, userId);
      item.isLoading = true;
    },
    orgUserLoaded: (state, action: PayloadAction<[number, ZetkinOrgUser]>) => {
      const [userId, user] = action.payload;
      const item = findOrAddItem(state.orgUserList, userId);
      item.loaded = new Date().toISOString();
      item.isLoading = false;
      item.data = user;
    },
    orgUsersLoad: (state) => {
      state.orgUserList.isLoading = true;
    },
    orgUsersLoaded: (state, action: PayloadAction<ZetkinOrgUser[]>) => {
      state.orgUserList = remoteList(action.payload);
      state.orgUserList.loaded = new Date().toISOString();
    },
    userLoad: (state) => {
      state.userItem = remoteItem('me');
      state.userItem.isLoading = true;
    },
    userLoaded: (state, action: PayloadAction<ZetkinUser>) => {
      const user = action.payload;
      state.userItem.data = user;
      state.userItem.loaded = new Date().toISOString();
      state.userItem.isLoading = false;
    },
    userUpdated: (state, action: PayloadAction<ZetkinUser>) => {
      const user = action.payload;
      state.userItem.data = user;
      state.userItem.loaded = new Date().toISOString();
      state.userItem.isLoading = false;
    },
  },
});

export default userSlice;
export const {
  membershipsLoad,
  membershipsLoaded,
  userLoad,
  userLoaded,
  orgUserLoad,
  orgUserLoaded,
  orgUsersLoad,
  orgUsersLoaded,
  userUpdated,
} = userSlice.actions;
