import { ZetkinMembership } from 'utils/types/zetkin';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';

export interface RolesStoreSlice {
  membershipsList: RemoteList<ZetkinMembership & { id: number }>;
}

const initialState: RolesStoreSlice = {
  membershipsList: remoteList(),
};

const RolesSlice = createSlice({
  initialState,
  name: 'roles',
  reducers: {
    accessDeleted: (state, action: PayloadAction<number>) => {
      const membershipId = action.payload;
      state.membershipsList.items = state.membershipsList.items.filter(
        (user) => user.id !== membershipId
      );
    },
    membershipsRolesLoad: (state) => {
      state.membershipsList.isLoading = true;
    },
    membershipsRolesLoaded: (
      state,
      action: PayloadAction<ZetkinMembership[]>
    ) => {
      const memberships = action.payload;

      const membershipsWithIds = memberships.map((membership) => ({
        ...membership,
        id: membership.profile.id,
      }));

      state.membershipsList = remoteList(membershipsWithIds);
      state.membershipsList.loaded = new Date().toISOString();
      state.membershipsList.isLoading = false;
    },
    updatedRole: (state, action: PayloadAction<[number, ZetkinMembership]>) => {
      const [membershipId, membership] = action.payload;
      const item = state.membershipsList.items.find(
        (item) => item.id === membershipId
      );

      if (item && item.data) {
        item.data.role = membership.role;
        item.data = { ...item.data, ...membership, id: membershipId };
      } else {
        state.membershipsList.items.push(
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

export default RolesSlice;
export const {
  accessDeleted,
  membershipsRolesLoad,
  membershipsRolesLoaded,
  updatedRole,
} = RolesSlice.actions;
