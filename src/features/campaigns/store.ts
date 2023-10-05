import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ZetkinCampaign } from 'utils/types/zetkin';
import { remoteItem, RemoteList, remoteList } from 'utils/storeUtils';

export interface CampaignsStoreSlice {
  recentlyCreatedCampaign: ZetkinCampaign | null;
  campaignList: RemoteList<ZetkinCampaign>;
}

const initialCampaignsState: CampaignsStoreSlice = {
  campaignList: remoteList(),
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
  },
});

export default campaignsSlice;
export const { campaignCreate, campaignCreated, campaignLoad, campaignLoaded } =
  campaignsSlice.actions;
