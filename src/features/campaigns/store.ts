import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { remoteItem, RemoteList, remoteList } from 'utils/storeUtils';
import {
  ZetkinCallAssignment,
  ZetkinCampaign,
  ZetkinSurvey,
} from 'utils/types/zetkin';

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
  },
});

export interface CampaignStoreSlice {
  callAssignmentList: RemoteList<ZetkinCallAssignment>;
  surveyList: RemoteList<ZetkinSurvey>;
}

const initialCampaignState: CampaignStoreSlice = {
  callAssignmentList: remoteList(),
  surveyList: remoteList(),
};

const campaignSlice = createSlice({
  initialState: initialCampaignState,
  name: 'campaign',
  reducers: {
    callAssignmentCreate: (state) => {
      state.callAssignmentList.isLoading = true;
    },
    callAssignmentCreated: (
      state,
      action: PayloadAction<ZetkinCallAssignment>
    ) => {
      const callAssignment = action.payload;
      state.callAssignmentList.isLoading = false;
      state.callAssignmentList.items.push(
        remoteItem(callAssignment.id, { data: callAssignment })
      );
    },
    surveyCreate: (state) => {
      state.surveyList.isLoading = true;
    },
    surveyCreated: (state, action: PayloadAction<ZetkinSurvey>) => {
      const survey = action.payload;
      state.surveyList.isLoading = false;
      state.surveyList.items.push(remoteItem(survey.id, { data: survey }));
    },
  },
});

export default campaignsSlice;
export const { campaignCreate, campaignCreated } = campaignsSlice.actions;
export const {
  surveyCreate,
  surveyCreated,
  callAssignmentCreate,
  callAssignmentCreated,
} = campaignSlice.actions;
