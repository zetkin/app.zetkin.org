import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  LaneStep,
  LaneState,
  ZetkinCall,
  SurveySubmissionData,
  Report,
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
      report: {
        callBackAfter: null,
        callerLog: '',
        completed: false,
        failureReason: null,
        leftMessage: false,
        organizerActionNeeded: false,
        organizerLog: '',
        step: 'successOrFailure',
        success: false,
        targetCouldTalk: false,
        wrongNumber: null,
      },
      respondedEventIds: [],
      step: LaneStep.STATS,
      submissionDataBySurveyId: {},
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
    clearReport: (state) => {
      state.lanes[state.activeLaneIndex].report = {
        callBackAfter: null,
        callerLog: '',
        completed: false,
        failureReason: null,
        leftMessage: false,
        organizerActionNeeded: false,
        organizerLog: '',
        step: 'successOrFailure',
        success: false,
        targetCouldTalk: false,
        wrongNumber: null,
      };
    },
    clearSurveySubmissions: (state) => {
      state.lanes[state.activeLaneIndex].submissionDataBySurveyId = {};
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
      state.outgoingCalls = remoteList(action.payload);
      state.outgoingCalls.loaded = new Date().toISOString();
    },
    previousCallAdd: (state, action: PayloadAction<ZetkinCall>) => {
      const call = action.payload;
      state.lanes[state.activeLaneIndex].previousCall = call;
    },
    previousCallClear: (state) => {
      state.lanes[state.activeLaneIndex].previousCall = null;
    },
    reportUpdated: (state, action: PayloadAction<Report>) => {
      const report = action.payload;
      const lane = state.lanes[state.activeLaneIndex];
      lane.report = report;
    },
    setSurveySubmissionError: (state, action: PayloadAction<boolean>) => {
      state.lanes[state.activeLaneIndex].surveySubmissionError = action.payload;
    },
    surveySubmissionAdded: (
      state,
      action: PayloadAction<[number, SurveySubmissionData]>
    ) => {
      const [surveyId, response] = action.payload;
      const responsesBySurveyId =
        state.lanes[state.activeLaneIndex].submissionDataBySurveyId;

      responsesBySurveyId[surveyId] = response;
    },
    surveySubmissionDeleted: (state, action: PayloadAction<number>) => {
      const surveyId = action.payload;

      const responsesBySurveyId =
        state.lanes[state.activeLaneIndex].submissionDataBySurveyId;

      delete responsesBySurveyId[surveyId];
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
  clearReport,
  eventsLoad,
  eventsLoaded,
  allocateCallError,
  clearCurrentCall,
  clearEventResponses,
  clearSurveySubmissions,
  callDeleted,
  eventResponseAdded,
  eventResponseRemoved,
  allocateNewCall,
  newCallAllocated,
  outgoingCallsLoad,
  outgoingCallsLoaded,
  previousCallAdd,
  previousCallClear,
  reportUpdated,
  setSurveySubmissionError,
  surveySubmissionAdded,
  surveySubmissionDeleted,
  updateLaneStep,
} = CallSlice.actions;
