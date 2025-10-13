import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dayjs } from 'dayjs';
import { DateRange } from '@mui/x-date-pickers-pro';

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
import { EphemeralQueryStats } from 'features/smartSearch/store';
import { ZetkinSmartSearchFilterStats } from 'features/smartSearch/types';

type OrgEventFilters = {
  customDatesToFilterBy: DateRange<Dayjs>;
  dateFilterState: 'today' | 'tomorrow' | 'thisWeek' | 'custom' | null;
  eventTypesToFilterBy: (string | null)[];
  geojsonToFilterBy: GeoJSON.Feature[];
  orgIdsToFilterBy: number[];
};

export interface OrganizationsStoreSlice {
  eventsByOrgId: Record<number, RemoteList<ZetkinEvent>>;
  filters: OrgEventFilters;
  orgData: RemoteItem<ZetkinOrganization>;
  subOrgsByOrgId: Record<number, RemoteList<ZetkinSubOrganization>>;
  statsBySuborgId: Record<number, RemoteItem<EphemeralQueryStats>>;
  treeDataList: RemoteList<TreeItemData>;
  userMembershipList: RemoteList<ZetkinMembership & { id: number }>;
}

const initialState: OrganizationsStoreSlice = {
  eventsByOrgId: {},
  filters: {
    customDatesToFilterBy: [null, null],
    dateFilterState: null,
    eventTypesToFilterBy: [],
    geojsonToFilterBy: [],
    orgIdsToFilterBy: [],
  },
  orgData: remoteItem(0),
  statsBySuborgId: {},
  subOrgsByOrgId: {},
  treeDataList: remoteList(),
  userMembershipList: remoteList(),
};

const OrganizationsSlice = createSlice({
  initialState,
  name: 'organizations',
  reducers: {
    filtersUpdated: (
      state,
      action: PayloadAction<Partial<OrgEventFilters>>
    ) => {
      const updatedFilters = action.payload;
      state.filters = { ...state.filters, ...updatedFilters };
    },
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
    orgFollowed: (state, action: PayloadAction<ZetkinMembership>) => {
      const membership = action.payload;

      const existingMembership = state.userMembershipList.items.find(
        (item) => item?.data?.organization.id === membership.organization.id
      );

      if (existingMembership?.data) {
        existingMembership.data.follow = true;
        existingMembership.loaded = new Date().toISOString();
      } else {
        const membershipWithId: ZetkinMembership & { id: number } = {
          ...membership,
          follow: true,
          id: membership.organization.id,
        };

        state.userMembershipList.items.push(
          remoteItem(membership.organization.id, {
            data: membershipWithId,
            loaded: new Date().toISOString(),
          })
        );
      }
    },
    orgUnfollowed: (state, action: PayloadAction<number>) => {
      const orgId = action.payload;

      const membershipToUpdate = state.userMembershipList.items.find(
        (membership) => membership.id === orgId
      );

      if (membershipToUpdate?.data) {
        membershipToUpdate.data.follow = false;
        membershipToUpdate.loaded = new Date().toISOString();
      }
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
    suborgStatsLoad: (state, action: PayloadAction<number>) => {
      const orgId = action.payload;
      if (!state.statsBySuborgId[orgId]) {
        state.statsBySuborgId[orgId] = remoteItem<EphemeralQueryStats>(orgId);
      }
      state.statsBySuborgId[orgId].isLoading = true;
    },
    suborgStatsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinSmartSearchFilterStats[]]>
    ) => {
      const [orgId, filterStats] = action.payload;
      state.statsBySuborgId[orgId].data = {
        id: orgId.toString(),
        stats: filterStats,
      };
      state.statsBySuborgId[orgId].isLoading = false;
      state.statsBySuborgId[orgId].loaded = new Date().toISOString();
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
  filtersUpdated,
  orgEventsLoad,
  orgEventsLoaded,
  organizationLoaded,
  organizationLoad,
  orgFollowed,
  orgUnfollowed,
  treeDataLoad,
  treeDataLoaded,
  subOrgsLoad,
  subOrgsLoaded,
  suborgStatsLoad,
  suborgStatsLoaded,
  userMembershipsLoad,
  userMembershipsLoaded,
} = OrganizationsSlice.actions;
