import { ZetkinOrganization } from 'utils/types/zetkin';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { remoteList, RemoteList } from 'utils/storeUtils';

export interface OrganizationsStoreSlice {
  userOrgList: RemoteList<ZetkinOrganization>;
}

const initialState: OrganizationsStoreSlice = {
  userOrgList: remoteList(),
};

const OrganizationsSlice = createSlice({
  initialState,
  name: 'organizations',
  reducers: {
    organizationsLoad: (state) => {
      state.userOrgList.isLoading = true;
    },
    organizationsLoaded: (
      state,
      action: PayloadAction<ZetkinOrganization[]>
    ) => {
      const organizationsList = action.payload;

      state.userOrgList = remoteList(organizationsList);
      state.userOrgList.loaded = new Date().toISOString();
      state.userOrgList.isLoading = false;
    },
  },
});

export default OrganizationsSlice;
export const { organizationsLoaded, organizationsLoad } =
  OrganizationsSlice.actions;
