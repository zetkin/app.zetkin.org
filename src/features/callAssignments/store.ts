import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  remoteItem,
  RemoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import {
  Call,
  CallAssignmentCaller,
  CallAssignmentData,
  CallAssignmentStats,
} from './apiTypes';

export interface CallAssignmentSlice {
  assignmentList: RemoteList<CallAssignmentData>;
  callAssignmentIdsByCampaignId: Record<
    number,
    RemoteList<{ id: string | number }>
  >;
  callersById: Record<number, RemoteList<CallAssignmentCaller>>;
  callList: RemoteList<Call>;
  statsById: Record<number, RemoteItem<CallAssignmentStats>>;
}

const initialState: CallAssignmentSlice = {
  assignmentList: remoteList(),
  callAssignmentIdsByCampaignId: {},
  callList: remoteList(),
  callersById: {},
  statsById: {},
};

const callAssignmentsSlice = createSlice({
  initialState,
  name: 'callAssignments',
  reducers: {
    callAssignmentCreate: (state) => {
      state.assignmentList.isLoading = true;
    },
    callAssignmentCreated: (
      state,
      action: PayloadAction<[CallAssignmentData, number]>
    ) => {
      const [callAssignment] = action.payload;
      state.assignmentList.isLoading = false;
      state.assignmentList.items.push(
        remoteItem(callAssignment.id, { data: callAssignment })
      );
      if (callAssignment.campaign) {
        state.callAssignmentIdsByCampaignId[callAssignment.campaign.id] =
          remoteList([
            ...state.callAssignmentIdsByCampaignId[callAssignment.campaign.id]
              .items,
            { id: callAssignment.id },
          ]);
      }
    },
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
            JSON.stringify(callAssignment?.target.filter_spec) ||
          JSON.stringify(assignment.goal.filter_spec) !=
            JSON.stringify(callAssignment?.goal.filter_spec))
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
    callAssignmentsLoad: (state) => {
      state.assignmentList.isLoading = true;
    },
    callAssignmentsLoaded: (
      state,
      action: PayloadAction<CallAssignmentData[]>
    ) => {
      const assignments = action.payload;
      const timestamp = new Date().toISOString();
      state.assignmentList = remoteList(assignments);
      state.assignmentList.loaded = timestamp;
      state.assignmentList.items.forEach((item) => (item.loaded = timestamp));
    },
    callUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [id, attributes] = action.payload;
      const callItem = state.callList.items.find((item) => item.id == id);

      if (callItem) {
        callItem.mutating = callItem.mutating
          .filter((attr) => !attributes.includes(attr))
          .concat(attributes);
      }
    },
    callUpdated: (state, action: PayloadAction<[Call, string[]]>) => {
      const [call, mutating] = action.payload;
      const callItem = state.callList.items.find((item) => item.id == call.id);

      if (callItem) {
        callItem.mutating = callItem.mutating.filter((attr) =>
          mutating.includes(attr)
        );
      }

      state.callList.items = state.callList.items
        .filter((c) => c.id != call?.id)
        .concat([remoteItem(call.id, { data: call })]);
    },
    callerAdd: (state, action: PayloadAction<[number, number]>) => {
      const [assignmentId, callerId] = action.payload;
      state.callersById[assignmentId].items.push(
        remoteItem(callerId, { isLoading: true })
      );
    },
    callerAdded: (
      state,
      action: PayloadAction<[number, CallAssignmentCaller]>
    ) => {
      const [caId, caller] = action.payload;
      state.callersById[caId].items = state.callersById[caId].items
        .filter((c) => c.id != caller.id)
        .concat([remoteItem(caller.id, { data: caller })]);
    },
    callerConfigure: (state, action: PayloadAction<[number, number]>) => {
      const [caId, callerId] = action.payload;
      const item = state.callersById[caId].items.find(
        (item) => item.id == callerId
      );
      if (item) {
        item.isLoading = true;
      }
    },
    callerConfigured: (
      state,
      action: PayloadAction<[number, CallAssignmentCaller]>
    ) => {
      const [caId, caller] = action.payload;
      const item = state.callersById[caId].items.find(
        (item) => item.id == caller.id
      );
      if (item) {
        item.isLoading = false;
        item.data = caller;
      }
    },
    callerRemove: (state, action: PayloadAction<[number, number]>) => {
      const [caId, callerId] = action.payload;
      const item = state.callersById[caId].items.find(
        (item) => item.id == callerId
      );
      if (item) {
        item.isLoading = true;
      }
    },
    callerRemoved: (state, action: PayloadAction<[number, number]>) => {
      const [caId, callerId] = action.payload;
      state.callersById[caId].items = state.callersById[caId].items.filter(
        (item) => item.id != callerId
      );
    },
    callersLoad: (state, action: PayloadAction<number>) => {
      state.callersById[action.payload] = remoteList<CallAssignmentCaller>();
      state.callersById[action.payload].isLoading = true;
    },
    callersLoaded: (
      state,
      action: PayloadAction<[CallAssignmentCaller[], number]>
    ) => {
      const [callers, assignmentId] = action.payload;
      const timestamp = new Date().toISOString();

      state.callersById[assignmentId] = remoteList(callers);
      state.callersById[assignmentId].loaded = timestamp;
    },
    campaignCallAssignmentsLoad: (state, action: PayloadAction<number>) => {
      const campaignId = action.payload;
      if (!state.callAssignmentIdsByCampaignId[campaignId]) {
        state.callAssignmentIdsByCampaignId[campaignId] = remoteList();
      }
      state.callAssignmentIdsByCampaignId[campaignId].isLoading = true;
    },
    campaignCallAssignmentsLoaded: (
      state,
      action: PayloadAction<[number, { id: string | number }[]]>
    ) => {
      const [campaignId, callAssignmentIds] = action.payload;
      const timestamp = new Date().toISOString();

      state.callAssignmentIdsByCampaignId[campaignId] =
        remoteList(callAssignmentIds);
      state.callAssignmentIdsByCampaignId[campaignId].loaded = timestamp;
    },
    statsLoad: (state, action: PayloadAction<number | string>) => {
      const id = action.payload as number;
      const statsItem = state.statsById[id];
      state.statsById[id] = remoteItem<CallAssignmentStats>(id, {
        data: statsItem?.data || {
          allTargets: 0,
          allocated: 0,
          blocked: 0,
          callBackLater: 0,
          calledTooRecently: 0,
          callsMade: 0,
          done: 0,
          id: id,
          missingPhoneNumber: 0,
          mostRecentCallTime: null,
          organizerActionNeeded: 0,
          queue: 0,
          ready: 0,
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
          loaded: new Date().toISOString(),
        }
      );
    },
  },
});

export default callAssignmentsSlice;
export const {
  callAssignmentCreate,
  callAssignmentCreated,
  callAssignmentLoad,
  callAssignmentLoaded,
  callAssignmentUpdate,
  callAssignmentUpdated,
  callAssignmentsLoad,
  callAssignmentsLoaded,
  callUpdate,
  callUpdated,
  callerAdd,
  callerAdded,
  callerConfigure,
  callerConfigured,
  callerRemove,
  callerRemoved,
  callersLoad,
  callersLoaded,
  campaignCallAssignmentsLoad,
  campaignCallAssignmentsLoaded,
  statsLoad,
  statsLoaded,
} = callAssignmentsSlice.actions;
