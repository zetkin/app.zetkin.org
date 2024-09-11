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
import emailsSlice, {
  emailCreated,
  EmailStoreSlice,
} from 'features/emails/store';
import eventsSlice, { EventsStoreSlice } from 'features/events/store';
import filesSlice, { FilesStoreSlice } from 'features/files/store';
import importSlice, { ImportStoreSlice } from 'features/import/store';
import joinFormsSlice, { JoinFormsStoreSlice } from 'features/joinForms/store';
import journeysSlice, {
  journeyInstanceCreated,
  JourneysStoreSlice,
} from 'features/journeys/store';
import organizationsSlice, {
  OrganizationsStoreSlice,
} from 'features/organizations/store';
import potentialDuplicatesSlice, {
  PotentialDuplicatesStoreSlice,
} from 'features/duplicates/store';
import profilesSlice, { ProfilesStoreSlice } from 'features/profile/store';
import searchSlice, { SearchStoreSlice } from 'features/search/store';
import settingsSlice, { SettingsStoreSlice } from 'features/settings/store';
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
import areasSlice, {
  AreasStoreSlice,
  canvassAssignmentCreated,
} from 'features/areas/store';

export interface RootState {
  areas: AreasStoreSlice;
  breadcrumbs: BreadcrumbsStoreSlice;
  callAssignments: CallAssignmentSlice;
  campaigns: CampaignsStoreSlice;
  duplicates: PotentialDuplicatesStoreSlice;
  emails: EmailStoreSlice;
  events: EventsStoreSlice;
  files: FilesStoreSlice;
  import: ImportStoreSlice;
  joinForms: JoinFormsStoreSlice;
  journeys: JourneysStoreSlice;
  organizations: OrganizationsStoreSlice;
  profiles: ProfilesStoreSlice;
  settings: SettingsStoreSlice;
  search: SearchStoreSlice;
  smartSearch: smartSearchStoreSlice;
  surveys: SurveysStoreSlice;
  tags: TagsStoreSlice;
  tasks: TasksStoreSlice;
  views: ViewsStoreSlice;
  user: UserStoreSlice;
}

const reducer = {
  areas: areasSlice.reducer,
  breadcrumbs: breadcrumbsSlice.reducer,
  callAssignments: callAssignmentsSlice.reducer,
  campaigns: campaignsSlice.reducer,
  duplicates: potentialDuplicatesSlice.reducer,
  emails: emailsSlice.reducer,
  events: eventsSlice.reducer,
  files: filesSlice.reducer,
  import: importSlice.reducer,
  joinForms: joinFormsSlice.reducer,
  journeys: journeysSlice.reducer,
  organizations: organizationsSlice.reducer,
  profiles: profilesSlice.reducer,
  search: searchSlice.reducer,
  settings: settingsSlice.reducer,
  smartSearch: smartSearchSlice.reducer,
  surveys: surveysSlice.reducer,
  tags: tagsSlice.reducer,
  tasks: tasksSlice.reducer,
  user: userSlice.reducer,
  views: viewsSlice.reducer,
};

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: canvassAssignmentCreated,
  effect: (action) => {
    const canvassAssignment = action.payload;
    Router.push(
      `/organize/${canvassAssignment.orgId}/projects/${canvassAssignment.campId}/canvassassignments/${canvassAssignment.id}`
    );
  },
});

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
  actionCreator: emailCreated,
  effect: (action) => {
    const email = action.payload;
    Router.push(
      `/organize/${email.organization.id}/projects/${
        email.campaign?.id ?? 'standalone'
      }/emails/${email.id}`
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
export const store = createStore();
