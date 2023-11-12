import { TreeItemData } from './types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  remoteItem,
  RemoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import { ZetkinMembership, ZetkinOrganization } from 'utils/types/zetkin';

export interface OrganizationsStoreSlice {
  orgData: RemoteItem<ZetkinOrganization>;
  treeDataList: RemoteList<TreeItemData>;
  userOrgList: RemoteList<ZetkinMembership['organization']>;
  subOrgsData: RemoteList<ZetkinOrganization>;
}

const initialState: OrganizationsStoreSlice = {
  orgData: remoteItem(0),
  treeDataList: remoteList(),
  userOrgList: remoteList(),
  subOrgsData: remoteList(),
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
      state.userOrgList.isLoading = true;
    },
    userOrganizationsLoaded: (
      state,
      action: PayloadAction<ZetkinMembership['organization'][]>
    ) => {
      const organizationsList = action.payload;

      state.userOrgList = remoteList(organizationsList);
      state.userOrgList.loaded = new Date().toISOString();
      state.userOrgList.isLoading = false;
    },
    subOrganizationsLoad: (state) => {
      state.subOrgsData.isLoading = true;
    },
    subOrganizationsLoaded: (
      state,
      action: PayloadAction<ZetkinOrganization[]>
    ) => {
      const subOrgList = action.payload;

      state.subOrgsData = remoteList(subOrgList);
      state.subOrgsData.loaded = new Date().toISOString();
      state.subOrgsData.isLoading = false;
    },
  },
});

export default OrganizationsSlice;
export const {
  organizationLoaded,
  organizationLoad,
  treeDataLoad,
  treeDataLoaded,
  userOrganizationsLoad,
  userOrganizationsLoaded,
  subOrganizationsLoad,
  subOrganizationsLoaded,
} = OrganizationsSlice.actions;
