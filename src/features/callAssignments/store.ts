import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CallAssignmentData } from './apiTypes';

interface CallAssignmentSlice {
  callAssignments: CallAssignmentData[];
  isLoading: boolean;
}

const initialState: CallAssignmentSlice = {
  callAssignments: [],
  isLoading: false,
};

const callAssignmentsSlice = createSlice({
  initialState,
  name: 'callAssignments',
  reducers: {
    callAssignmentLoad: (state) => {
      state.isLoading = true;
    },
    callAssignmentLoaded: (
      state,
      action: PayloadAction<CallAssignmentData>
    ) => {
      state.isLoading = false;
      state.callAssignments = state.callAssignments
        .filter((ca) => ca.id != action.payload.id)
        .concat([action.payload]);
    },
  },
});

export default callAssignmentsSlice.reducer;
export const { callAssignmentLoad, callAssignmentLoaded } =
  callAssignmentsSlice.actions;
