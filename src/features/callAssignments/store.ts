import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  CallAssignmentCaller,
  CallAssignmentData,
  CallAssignmentStats,
} from './apiTypes';

interface CallAssignmentSlice {
  callAssignments: CallAssignmentData[];
  callersById: Record<number, CallAssignmentCaller[] | undefined>;
  isLoading: boolean;
  statsById: Record<number, CallAssignmentStats | undefined>;
}

const initialState: CallAssignmentSlice = {
  callAssignments: [],
  callersById: {},
  isLoading: false,
  statsById: {},
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
    callAssignmentUpdated: (
      state,
      action: PayloadAction<CallAssignmentData>
    ) => {
      const stats = state.statsById[action.payload.id];
      const callAssignment = state.callAssignments.find(
        (ca) => ca.id === action.payload.id
      );
      if (
        //TODO: clean up this hot mess w better caching logic
        callAssignment?.cooldown != action.payload.cooldown ||
        JSON.stringify(action.payload.target.filter_spec) !=
          JSON.stringify(callAssignment?.target.filter_spec)
      ) {
        if (stats) {
          stats.isStale = true;
        }
        state.callAssignments = state.callAssignments
          .filter((ca) => ca.id != action.payload.id)
          .concat([action.payload]);
      }
    },
    callersLoad: (state, action: PayloadAction<number>) => {
      state.callersById[action.payload] = [];
    },
    callersLoaded: (
      state,
      action: PayloadAction<{ callers: CallAssignmentCaller[]; id: number }>
    ) => {
      state.callersById[action.payload.id] = action.payload.callers;
    },
    statsLoad: (state, action: PayloadAction<number>) => {
      state.statsById[action.payload] = {
        allTargets: 0,
        allocated: 0,
        blocked: 0,
        callBackLater: 0,
        calledTooRecently: 0,
        done: 0,
        missingPhoneNumber: 0,
        organizerActionNeeded: 0,
        queue: 0,
        ready: 0,
        ...state.statsById[action.payload],
        isLoading: true,
        isStale: false,
      };
    },
    statsLoaded: (
      state,
      action: PayloadAction<CallAssignmentStats & { id: number }>
    ) => {
      state.isLoading = false;
      state.statsById[action.payload.id] = {
        allTargets: action.payload.allTargets,
        allocated: action.payload.allocated,
        blocked: action.payload.blocked,
        callBackLater: action.payload.callBackLater,
        calledTooRecently: action.payload.calledTooRecently,
        done: action.payload.done,
        isLoading: false,
        isStale: false,
        missingPhoneNumber: action.payload.missingPhoneNumber,
        organizerActionNeeded: action.payload.organizerActionNeeded,
        queue: action.payload.queue,
        ready: action.payload.ready,
      };
    },
  },
});

export default callAssignmentsSlice.reducer;
export const {
  callAssignmentLoad,
  callAssignmentLoaded,
  callAssignmentUpdated,
  callersLoad,
  callersLoaded,
  statsLoad,
  statsLoaded,
} = callAssignmentsSlice.actions;
