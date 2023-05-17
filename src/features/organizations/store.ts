import { ZetkinOrganization } from 'utils/types/zetkin';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  remoteItem,
  RemoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';

export interface OrganizationsStoreSlice {
  orgData: RemoteItem<ZetkinOrganization>;
  userOrgList: RemoteList<ZetkinOrganization>;
}

const initialState: OrganizationsStoreSlice = {
  orgData: remoteItem(0),
  userOrgList: remoteList(),
};

const OrganizationsSlice = createSlice({
  initialState,
  name: 'organizations',
  reducers: {
    organizationLoad: (state) => {
      state.orgData.isLoading = true;
    },
    organizationLoaded: (state, action: PayloadAction<ZetkinOrganization>) => {
      const org = action.payload;

      state.orgData.data = org;
      state.orgData.loaded = new Date().toISOString();
      state.orgData.isLoading = false;
    },
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
export const {
  organizationLoaded,
  organizationLoad,
  organizationsLoaded,
  organizationsLoad,
} = OrganizationsSlice.actions;
