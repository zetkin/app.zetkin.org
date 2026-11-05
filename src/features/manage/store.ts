import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  remoteItem,
  RemoteItem,
  remoteItemUpdated,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import { ZetkinMembership, ZetkinUser } from 'utils/types/zetkin';

export interface ManageStoreSlice {
  membershipsByUserId: Record<
    number,
    RemoteList<ZetkinMembership & { id: number }> | undefined
  >;
  users: RemoteList<ZetkinUser> | undefined;
  usersById: Record<number, RemoteItem<ZetkinUser> | undefined>;
}

const initialState: ManageStoreSlice = {
  membershipsByUserId: {},
  users: undefined,
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
      if (state.users) {
        remoteItemUpdated(state.users, user);
      }
    },
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
      const now = new Date().toISOString();

      const users = action.payload;
      state.users = remoteList(users);
      state.users.loaded = now;
      state.usersById = users.reduce(
        (prev, cur) => {
          prev[cur.id] = remoteItem(cur.id);
          prev[cur.id].data = cur;
          prev[cur.id].loaded = now;
          return prev;
        },
        {} as Record<number, RemoteItem<ZetkinUser>>
      );
    },
  },
});

export default searchSlice;
export const {
  usersError,
  usersLoad,
  usersLoaded,
  userUpdated,
  userError,
  userLoad,
  userLoaded,
  userMembershipsError,
  userMembershipsLoad,
  userMembershipsLoaded,
} = searchSlice.actions;
