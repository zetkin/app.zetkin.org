import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit';

import callAssignmentsSlice, {
  CallAssignmentSlice,
} from '../features/callAssignments/store';
import surveysSlice, { SurveysStoreSlice } from 'features/surveys/store';
import viewsSlice, { ViewsStoreSlice } from 'features/views/store';

export interface RootState {
  callAssignments: CallAssignmentSlice;
  surveys: SurveysStoreSlice;
  views: ViewsStoreSlice;
}

const reducer = {
  callAssignments: callAssignmentsSlice.reducer,
  surveys: surveysSlice.reducer,
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
