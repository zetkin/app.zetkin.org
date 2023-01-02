import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  remoteItem,
  RemoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';

import {
  CallAssignmentCaller,
  CallAssignmentData,
  CallAssignmentStats,
} from './apiTypes';

export interface CallAssignmentSlice {
  assignmentList: RemoteList<CallAssignmentData>;
  callersById: Record<number, RemoteList<CallAssignmentCaller>>;
  statsById: Record<number, RemoteItem<CallAssignmentStats>>;
}

const initialState: CallAssignmentSlice = {
  assignmentList: remoteList(),
  callersById: {},
  statsById: {},
};

const callAssignmentsSlice = createSlice({
  initialState,
  name: 'callAssignments',
  reducers: {
    callAssignmentLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.assignmentList.items.find((item) => item.id == id);
      state.assignmentList.items = state.assignmentList.items
        .filter((item) => item.id != id)
        .concat([remoteItem(id, { data: item?.data, isLoading: true })]);
    },
    callAssignmentLoaded: (
      state,
      action: PayloadAction<CallAssignmentData>
    ) => {
      const id = action.payload.id;
      const item = state.assignmentList.items.find((item) => item.id == id);

      if (!item) {
        throw new Error(
          'Finished loading something that never started loading'
        );
      }

      item.data = action.payload;
      item.loaded = new Date().toISOString();
      item.isLoading = false;
      item.isStale = false;
    },
    callAssignmentUpdate: (
      state,
      action: PayloadAction<[number, string[]]>
    ) => {
      const [id, attributes] = action.payload;
      const caItem = state.assignmentList.items.find((item) => item.id == id);

      if (caItem) {
        caItem.mutating = caItem.mutating
          .filter((attr) => !attributes.includes(attr))
          .concat(attributes);
      }
    },
    callAssignmentUpdated: (
      state,
      action: PayloadAction<[CallAssignmentData, string[]]>
    ) => {
      const [assignment, mutating] = action.payload;
      const statsItem = state.statsById[assignment.id];
      const caItem = state.assignmentList.items.find(
        (item) => item.id == assignment.id
      );
      const callAssignment = caItem?.data;

      if (
        statsItem &&
        (callAssignment?.cooldown != assignment.cooldown ||
          JSON.stringify(assignment.target.filter_spec) !=
            JSON.stringify(callAssignment?.target.filter_spec))
      ) {
        statsItem.isStale = true;
      }

      if (caItem) {
        caItem.mutating = caItem.mutating.filter((attr) =>
          mutating.includes(attr)
        );
      }

      state.assignmentList.items = state.assignmentList.items
        .filter((ca) => ca.id != assignment.id)
        .concat([remoteItem(assignment.id, { data: assignment })]);
    },
    callersLoad: (state, action: PayloadAction<number>) => {
      state.callersById[action.payload] = remoteList<CallAssignmentCaller>();
    },
    callersLoaded: (
      state,
      action: PayloadAction<{ callers: CallAssignmentCaller[]; id: number }>
    ) => {
      state.callersById[action.payload.id] = remoteList(action.payload.callers);
    },
    statsLoad: (state, action: PayloadAction<number>) => {
      const statsItem = state.statsById[action.payload];
      state.statsById[action.payload] = remoteItem(action.payload, {
        data: statsItem?.data || {
          allTargets: 0,
          allocated: 0,
          blocked: 0,
          callBackLater: 0,
          calledTooRecently: 0,
          done: 0,
          missingPhoneNumber: 0,
          mostRecentCallTime: null,
          organizerActionNeeded: 0,
          queue: 0,
          ready: 0,
          ...state.statsById[action.payload],
        },
        isLoading: true,
      });
    },
    statsLoaded: (
      state,
      action: PayloadAction<CallAssignmentStats & { id: number }>
    ) => {
      state.statsById[action.payload.id] = remoteItem<CallAssignmentStats>(
        action.payload.id,
        {
          data: action.payload,
          isLoading: false,
          isStale: false,
        }
      );
    },
  },
});

export default callAssignmentsSlice;
export const {
  callAssignmentLoad,
  callAssignmentLoaded,
  callAssignmentUpdate,
  callAssignmentUpdated,
  callersLoad,
  callersLoaded,
  statsLoad,
  statsLoaded,
} = callAssignmentsSlice.actions;
