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
import { orgFollowed, orgUnfollowed } from 'features/organizations/store';

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
  extraReducers: (builder) => {
    builder.addCase(orgFollowed, (state, action) => {
      const membership = action.payload;
      const existingItem = state.membershipList.items.find(
        (item) => item?.data?.organization.id === membership.organization.id
      );

      if (existingItem?.data) {
        existingItem.data.follow = true;
        existingItem.loaded = new Date().toISOString();
      }
    });
    builder.addCase(orgUnfollowed, (state, action) => {
      const orgId = action.payload;
      const existingItem = state.membershipList.items.find(
        (item) => item?.data?.organization.id === orgId
      );

      if (existingItem?.data) {
        existingItem.data.follow = false;
        existingItem.loaded = new Date().toISOString();
      }
    });
  },
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
