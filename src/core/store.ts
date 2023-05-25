import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit';

import callAssignmentsSlice, {
  CallAssignmentSlice,
} from '../features/callAssignments/store';
import eventsSlice, { EventsStoreSlice } from 'features/events/store';
import organizationsSlice, {
  OrganizationsStoreSlice,
} from 'features/organizations/store';
import surveysSlice, { SurveysStoreSlice } from 'features/surveys/store';
import tagsSlice, { TagsStoreSlice } from 'features/tags/store';
import tasksSlice, { TasksStoreSlice } from 'features/tasks/store';
import usersSlice, { UsersStoreSlice } from 'features/users/store/store';
import viewsSlice, { ViewsStoreSlice } from 'features/views/store';

export interface RootState {
  callAssignments: CallAssignmentSlice;
  events: EventsStoreSlice;
  surveys: SurveysStoreSlice;
  tags: TagsStoreSlice;
  tasks: TasksStoreSlice;
  views: ViewsStoreSlice;
  organizations: OrganizationsStoreSlice;
  users: UsersStoreSlice;
}

const reducer = {
  callAssignments: callAssignmentsSlice.reducer,
  events: eventsSlice.reducer,
  organizations: organizationsSlice.reducer,
  surveys: surveysSlice.reducer,
  tags: tagsSlice.reducer,
  tasks: tasksSlice.reducer,
  users: usersSlice.reducer,
  views: viewsSlice.reducer,
};

export default function createStore(
  preloadedState?: ConfigureStoreOptions<RootState>['preloadedState']
) {
  return configureStore({
    preloadedState: preloadedState,
    reducer: reducer,
  });
}

export type Store = ReturnType<typeof createStore>;
export type AppDispatch = Store['dispatch'];
