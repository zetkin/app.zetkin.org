import { configureStore } from '@reduxjs/toolkit';

import callAssignmentsReducer from '../features/callAssignments/store';

export default function createStore() {
  return configureStore({
    reducer: {
      callAssignments: callAssignmentsReducer,
    },
  });
}

export type Store = ReturnType<typeof createStore>;
export type RootState = ReturnType<Store['getState']>;
export type AppDispatch = Store['dispatch'];
