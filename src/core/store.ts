import Router from 'next/router';
import {
  configureStore,
  ConfigureStoreOptions,
  createListenerMiddleware,
} from '@reduxjs/toolkit';

import breadcrumbsSlice, {
  BreadcrumbsStoreSlice,
} from 'features/breadcrumbs/store';
import callAssignmentsSlice, {
  callAssignmentCreated,
  CallAssignmentSlice,
} from '../features/callAssignments/store';
import campaignsSlice, {
  campaignCreated,
  campaignDeleted,
  CampaignsStoreSlice,
} from 'features/campaigns/store';
import eventsSlice, { EventsStoreSlice } from 'features/events/store';
import journeysSlice, {
  journeyInstanceCreated,
  JourneysStoreSlice,
} from 'features/journeys/store';
import organizationsSlice, {
  OrganizationsStoreSlice,
} from 'features/organizations/store';
import profilesSlice, { ProfilesStoreSlice } from 'features/profile/store';
import searchSlice, { SearchStoreSlice } from 'features/search/store';
import smartSearchSlice, {
  smartSearchStoreSlice,
} from 'features/smartSearch/store';
import surveysSlice, {
  surveyCreated,
  SurveysStoreSlice,
} from 'features/surveys/store';
import tagsSlice, { TagsStoreSlice } from 'features/tags/store';
import tasksSlice, { TasksStoreSlice } from 'features/tasks/store';
import userSlice, { UserStoreSlice } from 'features/user/store';
import viewsSlice, { ViewsStoreSlice } from 'features/views/store';

export interface RootState {
  breadcrumbs: BreadcrumbsStoreSlice;
  callAssignments: CallAssignmentSlice;
  campaigns: CampaignsStoreSlice;
  events: EventsStoreSlice;
  journeys: JourneysStoreSlice;
  organizations: OrganizationsStoreSlice;
  profiles: ProfilesStoreSlice;
  search: SearchStoreSlice;
  smartSearch: smartSearchStoreSlice;
  surveys: SurveysStoreSlice;
  tags: TagsStoreSlice;
  tasks: TasksStoreSlice;
  views: ViewsStoreSlice;
  user: UserStoreSlice;
}

const reducer = {
  breadcrumbs: breadcrumbsSlice.reducer,
  callAssignments: callAssignmentsSlice.reducer,
  campaigns: campaignsSlice.reducer,
  events: eventsSlice.reducer,
  journeys: journeysSlice.reducer,
  organizations: organizationsSlice.reducer,
  profiles: profilesSlice.reducer,
  search: searchSlice.reducer,
  smartSearch: smartSearchSlice.reducer,
  surveys: surveysSlice.reducer,
  tags: tagsSlice.reducer,
  tasks: tasksSlice.reducer,
  user: userSlice.reducer,
  views: viewsSlice.reducer,
};

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: campaignDeleted,
  effect: (action) => {
    const orgId = action.payload[0];
    Router.push(`/organize/${orgId}/projects`);
  },
});

listenerMiddleware.startListening({
  actionCreator: campaignCreated,
  effect: (action) => {
    const campaign = action.payload;
    Router.push(
      `/organize/${campaign.organization?.id}/projects/${campaign.id}`
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: callAssignmentCreated,
  effect: (action) => {
    const [callAssignment, campId] = action.payload;
    Router.push(
      `/organize/${callAssignment.organization?.id}/projects/${campId}/callassignments/${callAssignment.id}`
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: surveyCreated,
  effect: (action) => {
    const survey = action.payload;
    Router.push(
      `/organize/${survey.organization.id}/projects/${
        survey.campaign?.id ?? 'standalone'
      }/surveys/${survey.id}`
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: journeyInstanceCreated,
  effect: (action) => {
    const journeyInstance = action.payload;
    Router.push(
      `/organize/${journeyInstance.organization.id}/journeys/${journeyInstance.journey.id}/${journeyInstance.id}`
    );
  },
});

export default function createStore(
  preloadedState?: ConfigureStoreOptions<RootState>['preloadedState']
) {
  return configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(listenerMiddleware.middleware),
    preloadedState: preloadedState,
    reducer: reducer,
  });
}

export type Store = ReturnType<typeof createStore>;
export type AppDispatch = Store['dispatch'];
