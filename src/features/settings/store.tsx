import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinMembership } from 'utils/types/zetkin';
import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';

export interface SettingsStoreSlice {
  officialMembershipsList: RemoteList<ZetkinMembership & { id: number }>;
}

const initialState: SettingsStoreSlice = {
  officialMembershipsList: remoteList(),
};

const settingsSlice = createSlice({
  initialState,
  name: 'settings',
  reducers: {
    accessDeleted: (state, action: PayloadAction<number>) => {
      const membershipId = action.payload;
      state.officialMembershipsList.items =
        state.officialMembershipsList.items.filter(
          (user) => user.id !== membershipId
        );
    },
    officialMembershipsLoad: (state) => {
      state.officialMembershipsList.isLoading = true;
    },
    officialMembershipsLoaded: (
      state,
      action: PayloadAction<ZetkinMembership[]>
    ) => {
      const memberships = action.payload;

      const membershipsWithIds = memberships.map((membership) => ({
        ...membership,
        id: membership.profile.id,
      }));

      state.officialMembershipsList = remoteList(membershipsWithIds);
      state.officialMembershipsList.loaded = new Date().toISOString();
      state.officialMembershipsList.isLoading = false;
    },
    roleUpdated: (state, action: PayloadAction<[number, ZetkinMembership]>) => {
      const [membershipId, membership] = action.payload;
      const item = state.officialMembershipsList.items.find(
        (item) => item.id === membershipId
      );

      if (item && item.data) {
        item.data.role = membership.role;
        item.data = { ...item.data, ...membership, id: membershipId };
      } else {
        state.officialMembershipsList.items.push(
          remoteItem(membershipId, {
            data: {
              ...membership,
              id: membershipId,
            },
          })
        );
      }
    },
  },
});

export default settingsSlice;
export const {
  accessDeleted,
  officialMembershipsLoad,
  officialMembershipsLoaded,
  roleUpdated,
} = settingsSlice.actions;
