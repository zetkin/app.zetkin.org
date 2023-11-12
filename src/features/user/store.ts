import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  RemoteItem,
  remoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import { ZetkinMembership, ZetkinUser } from 'utils/types/zetkin';

export interface UserStoreSlice {
  membershipList: RemoteList<ZetkinMembership & { id: number }>;
  userItem: RemoteItem<ZetkinUser>;
}


const initialState: UserStoreSlice = {
  membershipList: remoteList(),
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
      const memberships = action.payload;
      const timestamp = new Date().toISOString();

      const membershipsWithIds = memberships.map((membership) => ({
        ...membership,
        id: membership.organization.id,
      }));

      state.membershipList = remoteList(membershipsWithIds);
      state.membershipList.loaded = timestamp;
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
  },
});

export default userSlice;
export const { membershipsLoad, membershipsLoaded, userLoad, userLoaded } =
  userSlice.actions;
