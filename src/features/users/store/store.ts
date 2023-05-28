import { ZetkinUser } from 'utils/types/zetkin';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RemoteItem, remoteItem } from 'utils/storeUtils';

export interface UserStoreSlice {
  userItem: RemoteItem<ZetkinUser>;
}

const initialState: UserStoreSlice = {
  userItem: remoteItem(0),
};

const userSlice = createSlice({
  initialState: initialState,
  name: 'user',
  reducers: {
    userLoad: (state) => {
      state.userItem.isLoading = true;
    },
    userLoaded: (state, action: PayloadAction<ZetkinUser>) => {
      const user = action.payload;
      state.userItem.id = user.id;
      state.userItem.data = user;
      state.userItem.loaded = new Date().toISOString();
      state.userItem.isLoading = false;
    },
  },
});

export default userSlice;
export const { userLoad, userLoaded } = userSlice.actions;
