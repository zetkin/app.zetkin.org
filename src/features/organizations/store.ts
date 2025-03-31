import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TreeItemData } from './types';
import {
  remoteItem,
  RemoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import {
  ZetkinEvent,
  ZetkinMembership,
  ZetkinOrganization,
  ZetkinSubOrganization,
} from 'utils/types/zetkin';

export interface OrganizationsStoreSlice {
  eventsByOrgId: Record<number, RemoteList<ZetkinEvent>>;
  orgData: RemoteItem<ZetkinOrganization>;
  subOrgsByOrgId: Record<number, RemoteList<ZetkinSubOrganization>>;
  treeDataList: RemoteList<TreeItemData>;
  userMembershipList: RemoteList<ZetkinMembership & { id: number }>;
}

const initialState: OrganizationsStoreSlice = {
  eventsByOrgId: {},
  orgData: remoteItem(0),
  subOrgsByOrgId: {},
  treeDataList: remoteList(),
  userMembershipList: remoteList(),
};

const OrganizationsSlice = createSlice({
  initialState,
  name: 'organizations',
  reducers: {
    orgEventsLoad: (state, action: PayloadAction<number>) => {
      state.eventsByOrgId[action.payload] ||= remoteList();
      state.eventsByOrgId[action.payload].isLoading = true;
    },
    orgEventsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinEvent[]]>
    ) => {
      const [orgId, events] = action.payload;
      state.eventsByOrgId[orgId] = remoteList(events);
      state.eventsByOrgId[orgId].loaded = new Date().toISOString();
    },
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
    userMembershipsLoad: (state) => {
      state.userMembershipList.isLoading = true;
    },
    userMembershipsLoaded: (
      state,
      action: PayloadAction<ZetkinMembership[]>
    ) => {
      const memberships = action.payload;
      const membershipsWithIds = memberships.map((membership) => ({
        ...membership,
        id: membership.organization.id,
      }));
      state.userMembershipList = remoteList(membershipsWithIds);
      state.userMembershipList.loaded = new Date().toISOString();
      state.userMembershipList.isLoading = false;
    },
  },
});

export default OrganizationsSlice;
export const {
  orgEventsLoad,
  orgEventsLoaded,
  organizationLoaded,
  organizationLoad,
  treeDataLoad,
  treeDataLoaded,
  subOrgsLoad,
  subOrgsLoaded,
  userMembershipsLoad,
  userMembershipsLoaded,
} = OrganizationsSlice.actions;
