import { ZetkinOrganization } from 'utils/types/zetkin';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { remoteList, RemoteList } from 'utils/storeUtils';

export interface OrganizationsStoreSlice {
  allOrgs: RemoteList<ZetkinOrganization>;
}

const initialState: OrganizationsStoreSlice = {
  allOrgs: remoteList(),
};

const OrganizationsSlice = createSlice({
  initialState,
  name: 'organizations',
  reducers: {
    organizationsLoad: (state) => {
      state.allOrgs.isLoading = true;
    },
    organizationsLoaded: (
      state,
      action: PayloadAction<ZetkinOrganization[]>
    ) => {
      const organizationsList = action.payload;

      state.allOrgs = remoteList(organizationsList);
      state.allOrgs.loaded = new Date().toISOString();
      state.allOrgs.isLoading = false;
    },
  },
});

export default OrganizationsSlice;
export const { organizationsLoaded, organizationsLoad } =
  OrganizationsSlice.actions;
