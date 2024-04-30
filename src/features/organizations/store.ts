import { TreeItemData } from './types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  remoteItem,
  RemoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import {
  ZetkinMembership,
  ZetkinOrganization,
  ZetkinSubOrganization,
} from 'utils/types/zetkin';

export interface OrganizationsStoreSlice {
  orgData: RemoteItem<ZetkinOrganization>;
  subOrgsByOrgId: Record<number, RemoteList<ZetkinSubOrganization>>;
  treeDataList: RemoteList<TreeItemData>;
  userMembershipList: RemoteList<ZetkinMembership['organization']>;
}

const initialState: OrganizationsStoreSlice = {
  orgData: remoteItem(0),
  subOrgsByOrgId: {},
  treeDataList: remoteList(),
  userMembershipList: remoteList(), //userMembershipList
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
    subOrgsLoad: (state, action: PayloadAction<number>) => {
      const orgId = action.payload;
      if (!state.subOrgsByOrgId[orgId]) {
        state.subOrgsByOrgId[orgId] = remoteList();
      }
      state.subOrgsByOrgId[orgId].isLoading = true;
    },
    subOrgsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinSubOrganization[]]>
    ) => {
      const [orgId, subOrgs] = action.payload;

      state.subOrgsByOrgId[orgId] = remoteList(subOrgs);
      state.subOrgsByOrgId[orgId].loaded = new Date().toISOString();
      state.subOrgsByOrgId[orgId].isLoading = false;
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
    userOrganizationsLoad: (state) => {
      state.userMembershipList.isLoading = true;
    },
    userOrganizationsLoaded: (
      state,
      action: PayloadAction<ZetkinMembership['organization'][]>
    ) => {
      const organizationsList = action.payload;

      state.userMembershipList = remoteList(organizationsList);
      state.userMembershipList.loaded = new Date().toISOString();
      state.userMembershipList.isLoading = false;
    },
  },
});

export default OrganizationsSlice;
export const {
  organizationLoaded,
  organizationLoad,
  treeDataLoad,
  treeDataLoaded,
  subOrgsLoad,
  subOrgsLoaded,
  userOrganizationsLoad,
  userOrganizationsLoaded,
} = OrganizationsSlice.actions;
