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
import projectsSlice, {
  projectCreated,
  projectDeleted,
  ProjectsStoreSlice,
} from 'features/projects/store';
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
import areasSlice, { AreasStoreSlice } from 'features/areas/store';
import areaAssignmentSlice, {
  areaAssignmentCreated,
  AreaAssignmentsStoreSlice,
} from 'features/areaAssignments/store';
import canvassSlice, { CanvassStoreSlice } from 'features/canvass/store';
import callSlice, { CallStoreSlice } from 'features/call/store';

export interface RootState {
  areaAssignments: AreaAssignmentsStoreSlice;
  areas: AreasStoreSlice;
  breadcrumbs: BreadcrumbsStoreSlice;
  call: CallStoreSlice;
  callAssignments: CallAssignmentSlice;
  projects: ProjectsStoreSlice;
  canvass: CanvassStoreSlice;
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
  areaAssignments: areaAssignmentSlice.reducer,
  areas: areasSlice.reducer,
  breadcrumbs: breadcrumbsSlice.reducer,
  call: callSlice.reducer,
  callAssignments: callAssignmentsSlice.reducer,
  canvass: canvassSlice.reducer,
  duplicates: potentialDuplicatesSlice.reducer,
  emails: emailsSlice.reducer,
  events: eventsSlice.reducer,
  files: filesSlice.reducer,
  import: importSlice.reducer,
  joinForms: joinFormsSlice.reducer,
  journeys: journeysSlice.reducer,
  organizations: organizationsSlice.reducer,
  profiles: profilesSlice.reducer,
  projects: projectsSlice.reducer,
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
  actionCreator: areaAssignmentCreated,
  effect: (action) => {
    const { organization_id, project_id, id } = action.payload;
    Router.push(
      `/organize/${organization_id}/projects/${project_id}/areaassignments/${id}`
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: projectDeleted,
  effect: (action) => {
    const orgId = action.payload[0];
    Router.push(`/organize/${orgId}/projects`);
  },
});

listenerMiddleware.startListening({
  actionCreator: projectCreated,
  effect: (action) => {
    const project = action.payload;
    Router.push(`/organize/${project.organization?.id}/projects/${project.id}`);
  },
});

listenerMiddleware.startListening({
  actionCreator: emailCreated,
  effect: (action) => {
    const email = action.payload;
    Router.push(
      `/organize/${email.organization.id}/projects/${
        email.project?.id ?? 'standalone'
      }/emails/${email.id}`
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: callAssignmentCreated,
  effect: (action) => {
    const [callAssignment, projectId] = action.payload;
    Router.push(
      `/organize/${callAssignment.organization?.id}/projects/${projectId}/callassignments/${callAssignment.id}`
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: surveyCreated,
  effect: (action) => {
    const survey = action.payload;
    Router.push(
      `/organize/${survey.organization.id}/projects/${
        survey.project?.id ?? 'standalone'
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
