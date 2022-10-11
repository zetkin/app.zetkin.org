import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CallAssignmentData } from './apiTypes';

interface CallAssignmentSlice {
  callAssignments: CallAssignmentData[];
}

const initialState: CallAssignmentSlice = {
  callAssignments: [],
};

const callAssignmentsSlice = createSlice({
  initialState,
  name: 'callAssignments',
  reducers: {
    callAssignmentLoaded: (
      state,
      action: PayloadAction<CallAssignmentData>
    ) => {
      state.callAssignments = state.callAssignments
        .filter((ca) => ca.id != action.payload.id)
        .concat([action.payload]);
    },
  },
});

export default callAssignmentsSlice.reducer;
export const { callAssignmentLoaded } = callAssignmentsSlice.actions;
