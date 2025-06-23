import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  CallState,
  LaneStep,
  LaneState,
  ZetkinCall,
  ZetkinCallPatchBody,
} from './types';
import {
  RemoteItem,
  remoteItem,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import { ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';
import { SerializedError } from './hooks/useAllocateCall';

export interface CallStoreSlice {
  activeLaneIndex: number;
  currentCallId: number | null;
  eventsByTargetId: Record<number, RemoteList<ZetkinEventWithStatus>>;
  filledSurveys: { surveyId: number; targetId: number }[];
  lanes: LaneState[];
  outgoingCalls: RemoteList<ZetkinCall>;
  queueHasError: SerializedError | null;
  stateByCallId: Record<number, RemoteItem<CallState>>;
}

const initialState: CallStoreSlice = {
  activeLaneIndex: 0,
  currentCallId: null,
  eventsByTargetId: {},
  filledSurveys: [],
  lanes: [
    {
      step: LaneStep.STATS,
    },
  ],
  outgoingCalls: remoteList(),
  queueHasError: null,
  stateByCallId: {},
};

const CallSlice = createSlice({
  initialState,
  name: 'call',
  reducers: {
    activeEventsLoad: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (!state.eventsByTargetId[id]) {
        state.eventsByTargetId[id] = remoteList();
      }

      state.eventsByTargetId[id].isLoading = true;
    },
    activeEventsLoaded: (
      state,
      action: PayloadAction<[number, ZetkinEventWithStatus[]]>
    ) => {
      const [id, events] = action.payload;
      const eventsWithStatus = events.map((event) => ({
        ...event,
        status: null,
      }));

      state.eventsByTargetId[id] = remoteList(eventsWithStatus);
      state.eventsByTargetId[id].loaded = new Date().toISOString();
      state.eventsByTargetId[id].isLoading = false;
    },
    addSurveyKeys: (
      state,
      action: PayloadAction<{ surveyId: number; targetId: number }>
    ) => {
      const exists = state.filledSurveys.some(
        (entry) =>
          entry.surveyId === action.payload.surveyId &&
          entry.targetId === action.payload.targetId
      );

      if (!exists) {
        state.filledSurveys.push(action.payload);
      }
    },
    allocateCallError: (state, action: PayloadAction<SerializedError>) => {
      const error = action.payload;
      state.queueHasError = error;
      state.outgoingCalls.isLoading = false;
    },
    allocateNewCall: (state) => {
      state.outgoingCalls.isLoading = true;
    },
    clearSurveysKeys: (state) => {
      state.filledSurveys = [];
    },
    currentCallDeleted: (state, action: PayloadAction<number>) => {
      const deletedCallId = action.payload;

      state.outgoingCalls.items = state.outgoingCalls.items.filter(
        (item) => item.id !== deletedCallId
      );

      const nextCall = state.outgoingCalls.items.find(
        (item) => item.data?.state === 0
      );

      state.currentCallId = nextCall ? Number(nextCall.id) : null;
    },
    newCallAllocated: (state, action: PayloadAction<ZetkinCall>) => {
      state.currentCallId = action.payload.id;
      state.queueHasError = null;

      const callExists = state.outgoingCalls.items.some(
        (call) => call.id === action.payload.id
      );
      if (!callExists) {
        state.outgoingCalls.items.push(
          remoteItem(action.payload.id, {
            data: action.payload,
            isLoading: false,
            isStale: false,
            loaded: new Date().toISOString(),
          })
        );
      }

      state.outgoingCalls.isLoading = false;
    },
    outgoingCallsLoad: (state) => {
      state.outgoingCalls.isLoading = true;
    },
    outgoingCallsLoaded: (state, action: PayloadAction<ZetkinCall[]>) => {
      const payloadItems = action.payload.map((call) =>
        remoteItem(call.id, {
          data: call,
          isLoading: false,
          isStale: false,
          loaded: new Date().toISOString(),
        })
      );

      state.outgoingCalls.items = state.outgoingCalls.items
        .filter(
          (item) => !payloadItems.some((newItem) => newItem.id === item.id)
        )
        .concat(payloadItems);

      state.outgoingCalls.loaded = new Date().toISOString();
      state.outgoingCalls.isLoading = false;
    },
    reportAdded: (
      state,
      action: PayloadAction<[number, ZetkinCallPatchBody]>
    ) => {
      const [id, report] = action.payload;
      state.stateByCallId[id] = remoteItem(id, {
        data: { id, report },
        loaded: new Date().toISOString(),
      });
    },
    reportDeleted: (state, action: PayloadAction<number>) => {
      const callId = action.payload;
      delete state.stateByCallId[callId];
    },
    targetSubmissionAdded: (
      state,
      action: PayloadAction<[number, ZetkinEvent]>
    ) => {
      const [targetId, event] = action.payload;

      const eventList = state.eventsByTargetId[targetId];
      const existingItem = eventList.items.find((item) => item.id === event.id);

      if (existingItem && existingItem.data) {
        existingItem.data = {
          ...existingItem.data,
          status: 'signedUp',
        };
      }
    },
    targetSubmissionDeleted: (
      state,
      action: PayloadAction<[number, number]>
    ) => {
      const [targetId, eventId] = action.payload;

      const eventList = state.eventsByTargetId[targetId];

      const existingItem = eventList.items.find((item) => item.id === eventId);

      if (existingItem && existingItem.data) {
        existingItem.data = {
          ...existingItem.data,
          status: null,
        };
      }
    },
    updateLaneStep: (state, action: PayloadAction<LaneStep>) => {
      const step = action.payload;

      const lane = state.lanes[state.activeLaneIndex];
      lane.step = step;
    },
  },
});

export default CallSlice;
export const {
  activeEventsLoad,
  activeEventsLoaded,
  addSurveyKeys,
  allocateCallError,
  clearSurveysKeys,
  currentCallDeleted,
  allocateNewCall,
  newCallAllocated,
  outgoingCallsLoad,
  outgoingCallsLoaded,
  reportAdded,
  reportDeleted,
  targetSubmissionAdded,
  targetSubmissionDeleted,
  updateLaneStep,
} = CallSlice.actions;
