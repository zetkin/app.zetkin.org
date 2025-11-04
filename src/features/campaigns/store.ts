import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dayjs } from 'dayjs';
import { DateRange } from '@mui/x-date-pickers-pro';

import { ZetkinCampaign } from 'utils/types/zetkin';
import { remoteItem, RemoteList, remoteList } from 'utils/storeUtils';

type CampaignEventFilters = {
  customDatesToFilterBy: DateRange<Dayjs>;
  dateFilterState: 'today' | 'tomorrow' | 'thisWeek' | 'custom' | null;
  eventTypesToFilterBy: string[];
  geojsonToFilterBy: GeoJSON.Feature[];
};

export interface CampaignsStoreSlice {
  campaignList: RemoteList<ZetkinCampaign>;
  campaignsByOrgId: Record<string, RemoteList<ZetkinCampaign>>;
  filters: CampaignEventFilters;
  recentlyCreatedCampaign: ZetkinCampaign | null;
}

const initialCampaignsState: CampaignsStoreSlice = {
  campaignList: remoteList(),
  campaignsByOrgId: {},
  filters: {
    customDatesToFilterBy: [null, null],
    dateFilterState: null,
    eventTypesToFilterBy: [],
    geojsonToFilterBy: [],
  },
  recentlyCreatedCampaign: null,
};

const campaignsSlice = createSlice({
  initialState: initialCampaignsState,
  name: 'campaigns',
  reducers: {
    campaignCreate: (state) => {
      state.campaignList.isLoading = true;
      state.recentlyCreatedCampaign = null;
    },
    campaignCreated: (state, action: PayloadAction<ZetkinCampaign>) => {
      const campaign = action.payload;
      state.campaignList.isLoading = false;
      state.campaignList.items.push(
        remoteItem(campaign.id, { data: campaign })
      );
      state.recentlyCreatedCampaign = campaign;
    },
    campaignDeleted: (
      state,
      action: PayloadAction<[orgId: number, campaignId: number]>
    ) => {
      const campaignId = action.payload[1];
      const campaignItem = state.campaignList.items.find(
        (item) => item.id === campaignId
      );

      if (campaignItem) {
        campaignItem.deleted = true;
        state.campaignList.isStale = true;
      }
    },
    campaignLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.campaignList.items.find((item) => item.id == id);
      state.campaignList.items = state.campaignList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    campaignLoaded: (state, action: PayloadAction<ZetkinCampaign>) => {
      const id = action.payload.id;
      const item = state.campaignList.items.find((item) => item.id == id);

      if (!item) {
        throw new Error(
          'Finished loading something that never started loading'
        );
      }

      item.data = action.payload;
      item.loaded = new Date().toISOString();
      item.isLoading = false;
      item.isStale = false;
    },
    campaignUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [id, attributes] = action.payload;
      const item = state.campaignList.items.find((item) => item.id == id);

      if (item) {
        item.mutating = item.mutating
          .filter((attr) => !attributes.includes(attr))
          .concat(attributes);
      }
    },
    campaignUpdated: (state, action: PayloadAction<ZetkinCampaign>) => {
      const campaign = action.payload;
      const item = state.campaignList.items.find(
        (item) => item.id == campaign.id
      );

      if (item) {
        item.data = { ...item.data, ...campaign };
        item.mutating = [];
      }
    },
    campaignsLoad: (state, action: PayloadAction<number[]>) => {
      const orgIds = action.payload;
      orgIds.forEach((orgId) => {
        const list = (state.campaignsByOrgId[orgId] ||= remoteList());
        list.isLoading = true;
      });
      state.campaignList.isLoading = true;
    },
    campaignsLoaded: (state, action: PayloadAction<ZetkinCampaign[]>) => {
      const campaigns = action.payload;
      const timestamp = new Date().toISOString();

      campaigns.forEach((campaign) => {
        const orgId = campaign.organization.id;
        const listByOrg = (state.campaignsByOrgId[orgId] ||=
          remoteList<ZetkinCampaign>([]));

        listByOrg.isLoading = false;
        listByOrg.loaded = timestamp;
        listByOrg.items.push(remoteItem(campaign.id, { data: campaign }));
      });

      state.campaignList = remoteList(campaigns);
      state.campaignList.loaded = timestamp;
      state.campaignList.items.forEach((item) => (item.loaded = timestamp));
    },
    filtersUpdated: (
      state,
      action: PayloadAction<Partial<CampaignEventFilters>>
    ) => {
      const updatedFilters = action.payload;
      state.filters = { ...state.filters, ...updatedFilters };
    },
  },
});

export default campaignsSlice;
export const {
  campaignCreate,
  campaignCreated,
  campaignDeleted,
  campaignLoad,
  campaignLoaded,
  campaignUpdate,
  campaignUpdated,
  campaignsLoad,
  campaignsLoaded,
  filtersUpdated,
} = campaignsSlice.actions;
