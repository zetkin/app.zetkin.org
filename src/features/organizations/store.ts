import { TreeItemData } from './rpc/getOrganizations';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  remoteItem,
  RemoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import { ZetkinMembership, ZetkinOrganization } from 'utils/types/zetkin';

interface Membership {
  organization: ZetkinOrganization;
  follow?: boolean;
  profile: {
    id: number;
    name: string;
  };
  inherited?: false;
  role: string | null;
  id: number;
}

export interface OrganizationsStoreSlice {
  membershipList: RemoteList<Membership>;
  orgData: RemoteItem<ZetkinOrganization>;
  orgList: RemoteList<ZetkinOrganization>;
  treeDataList: RemoteList<TreeItemData>;
  userOrgList: RemoteList<ZetkinOrganization>;
}

const initialState: OrganizationsStoreSlice = {
  membershipList: remoteList(),
  orgData: remoteItem(0),
  orgList: remoteList(),
  treeDataList: remoteList(),
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
      state.orgList.isLoading = true;
    },
    organizationsLoaded: (
      state,
      action: PayloadAction<ZetkinOrganization[]>
    ) => {
      const organizations = action.payload;

      state.orgList = remoteList(organizations);
      state.orgList.loaded = new Date().toISOString();
      state.orgList.isLoading = false;
    },
    treeDataLoad: (state) => {
      state.treeDataList.isLoading = true;
    },
    treeDataLoaded: (state, action: PayloadAction<TreeItemData[]>) => {
      const treeData = action.payload;

      state.treeDataList = remoteList(treeData);
      state.treeDataList.loaded = new Date().toISOString();
      state.treeDataList.isLoading = false;
    },
    userMembershipsLoad: (state) => {
      state.membershipList.isLoading = true;
    },
    userMembershipsLoaded: (
      state,
      action: PayloadAction<ZetkinMembership[]>
    ) => {
      const memberships = action.payload;
      const membershipsWithIds = memberships.map((data) => ({
        id: data.organization.id,
        ...data,
      }));

      state.membershipList = remoteList(membershipsWithIds);
      state.membershipList.loaded = new Date().toISOString();
      state.membershipList.isLoading = false;
    },
    userOrganizationsLoad: (state) => {
      state.userOrgList.isLoading = true;
    },
    userOrganizationsLoaded: (
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
  treeDataLoad,
  treeDataLoaded,
  userOrganizationsLoad,
  userOrganizationsLoaded,
  userMembershipsLoaded,
  userMembershipsLoad,
} = OrganizationsSlice.actions;
