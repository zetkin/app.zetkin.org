import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  LaneStep,
  LaneState,
  ZetkinCall,
  CallReport,
  SurveyResponse,
} from './types';
import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';
import { ZetkinEvent } from 'utils/types/zetkin';
import { SerializedError } from './hooks/useAllocateCall';

export interface CallStoreSlice {
  activeLaneIndex: number;
  currentCallId: number | null;
  upcomingEventsList: RemoteList<ZetkinEvent>;
  lanes: LaneState[];
  outgoingCalls: RemoteList<ZetkinCall>;
  queueHasError: SerializedError | null;
}

const initialState: CallStoreSlice = {
  activeLaneIndex: 0,
  currentCallId: null,
  lanes: [
    {
      previousCall: null,
      report: null,
      respondedEventIds: [],
      responseBySurveyId: {},
      step: LaneStep.STATS,
      surveySubmissionError: false,
    },
  ],
  outgoingCalls: remoteList(),
  queueHasError: null,
  upcomingEventsList: remoteList(),
};

const CallSlice = createSlice({
  initialState,
  name: 'call',
  reducers: {
    allocateCallError: (state, action: PayloadAction<SerializedError>) => {
      const error = action.payload;
      state.queueHasError = error;
      state.outgoingCalls.isLoading = false;
    },
    allocateNewCall: (state) => {
      state.outgoingCalls.isLoading = true;
    },
    callDeleted: (state, action: PayloadAction<number>) => {
      const deletedCallId = action.payload;
      state.outgoingCalls.items = state.outgoingCalls.items.filter(
        (item) => item.id != deletedCallId
      );
    },
    clearCurrentCall: (state) => {
      state.currentCallId = null;
    },
    clearEventResponses: (state) => {
      state.lanes[state.activeLaneIndex].respondedEventIds = [];
    },
    clearSurveyResponses: (state) => {
      state.lanes[state.activeLaneIndex].responseBySurveyId = {};
    },
    eventResponseAdded: (state, action: PayloadAction<number>) => {
      const eventIdToAdd = action.payload;
      const eventIds = state.lanes[state.activeLaneIndex].respondedEventIds;
      eventIds.push(eventIdToAdd);
    },
    eventResponseRemoved: (state, action: PayloadAction<number>) => {
      const eventIdToRemove = action.payload;
      const eventIds = state.lanes[state.activeLaneIndex].respondedEventIds;

      state.lanes[state.activeLaneIndex].respondedEventIds = eventIds.filter(
        (id) => id != eventIdToRemove
      );
    },
    eventsLoad: (state) => {
      state.upcomingEventsList.isLoading = true;
    },
    eventsLoaded: (state, action: PayloadAction<ZetkinEvent[]>) => {
      state.upcomingEventsList = remoteList(action.payload);
      state.upcomingEventsList.loaded = new Date().toISOString();
    },
    newCallAllocated: (state, action: PayloadAction<ZetkinCall>) => {
      state.currentCallId = action.payload.id;
      state.queueHasError = null;

      state.outgoingCalls.items.push(
        remoteItem(action.payload.id, {
          data: action.payload,
          isLoading: false,
          isStale: false,
          loaded: new Date().toISOString(),
        })
      );

      state.outgoingCalls.loaded = new Date().toISOString();
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
    previousCallAdd: (state, action: PayloadAction<ZetkinCall>) => {
      const call = action.payload;
      state.lanes[state.activeLaneIndex].previousCall = call;
    },
    previousCallClear: (state) => {
      state.lanes[state.activeLaneIndex].previousCall = null;
    },
    reportAdded: (state, action: PayloadAction<CallReport>) => {
      const report = action.payload;
      const lane = state.lanes[state.activeLaneIndex];
      lane.report = report;
    },
    reportDeleted: (state) => {
      state.lanes[state.activeLaneIndex].report = null;
    },
    setSurveySubmissionError: (state, action: PayloadAction<boolean>) => {
      state.lanes[state.activeLaneIndex].surveySubmissionError = action.payload;
    },
    surveyResponseAdded: (
      state,
      action: PayloadAction<[number, SurveyResponse]>
    ) => {
      const [surveyId, response] = action.payload;
      const responsesBySurveyId =
        state.lanes[state.activeLaneIndex].responseBySurveyId;

      responsesBySurveyId[surveyId] = response;
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
  eventsLoad,
  eventsLoaded,
  allocateCallError,
  clearCurrentCall,
  clearEventResponses,
  clearSurveyResponses,
  callDeleted,
  eventResponseAdded,
  eventResponseRemoved,
  allocateNewCall,
  newCallAllocated,
  outgoingCallsLoad,
  outgoingCallsLoaded,
  previousCallAdd,
  previousCallClear,
  reportAdded,
  reportDeleted,
  setSurveySubmissionError,
  surveyResponseAdded,
  updateLaneStep,
} = CallSlice.actions;
