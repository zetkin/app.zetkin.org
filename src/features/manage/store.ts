import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  remoteItem,
  RemoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import { ZetkinMembership, ZetkinUser } from 'utils/types/zetkin';

export interface ManageStoreSlice {
  membershipsByUserId: Record<
    number,
    RemoteList<ZetkinMembership & { id: number }> | undefined
  >;
  usersById: Record<number, RemoteItem<ZetkinUser> | undefined>;
}

const initialState: ManageStoreSlice = {
  membershipsByUserId: {},
  usersById: {},
};

const searchSlice = createSlice({
  initialState,
  name: 'manage',
  reducers: {
    userError: (state, action: PayloadAction<[number, string]>) => {
      const [userId, serializedError] = action.payload;
      state.usersById[userId] = remoteItem(userId);
      state.usersById[userId].error = serializedError;
      state.usersById[userId].loaded = new Date().toISOString();
    },
    userLoad: (state, action: PayloadAction<number>) => {
      const userId = action.payload;
      state.usersById[userId] = remoteItem(userId);
      state.usersById[userId].isLoading = true;
    },
    userLoaded: (state, action: PayloadAction<ZetkinUser>) => {
      const user = action.payload;
      state.usersById[user.id] = remoteItem(user.id);
      state.usersById[user.id]!.data = user;
      state.usersById[user.id]!.loaded = new Date().toISOString();
    },
    userMembershipsError: (state, action: PayloadAction<[number, string]>) => {
      const [userId, serializedError] = action.payload;
      state.membershipsByUserId[userId] = remoteList();
      state.membershipsByUserId[userId]!.error = serializedError;
      state.membershipsByUserId[userId]!.loaded = new Date().toISOString();
    },
    userMembershipsLoad: (state, action: PayloadAction<number>) => {
      const userId = action.payload;
      state.membershipsByUserId[userId] = remoteList();
      state.membershipsByUserId[userId]!.isLoading = true;
    },
    userMembershipsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinMembership[]]>
    ) => {
      const [userId, memberships] = action.payload;
      state.membershipsByUserId[userId] = remoteList(
        memberships.map((mem) => ({ ...mem, id: mem.organization.id }))
      );
      state.membershipsByUserId[userId]!.loaded = new Date().toISOString();
    },
    userUpdated: (state, action: PayloadAction<ZetkinUser>) => {
      const user = action.payload;
      state.usersById[user.id] = remoteItem(user.id);
      state.usersById[user.id]!.data = user;
      state.usersById[user.id]!.loaded = new Date().toISOString();
    },
  },
});

export default searchSlice;
export const {
  userUpdated,
  userError,
  userLoad,
  userLoaded,
  userMembershipsError,
  userMembershipsLoad,
  userMembershipsLoaded,
} = searchSlice.actions;
