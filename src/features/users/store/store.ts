import { ZetkinUser } from 'utils/types/zetkin';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RemoteItem, remoteItem } from 'utils/storeUtils';

export interface UsersStoreSlice {
  userItem: RemoteItem<ZetkinUser>;
}

const initialUsersState: UsersStoreSlice = {
  userItem: remoteItem(0),
};

const usersSlice = createSlice({
  initialState: initialUsersState,
  name: 'users',
  reducers: {
    userLoad: (state) => {
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

export default usersSlice;
export const { userLoad, userLoaded } = usersSlice.actions;
