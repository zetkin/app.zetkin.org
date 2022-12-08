import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit';

import callAssignmentsSlice, {
  CallAssignmentSlice,
} from '../features/callAssignments/store';

export interface RootState {
  callAssignments: CallAssignmentSlice;
}

const reducer = {
  callAssignments: callAssignmentsSlice.reducer,
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
