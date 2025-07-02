import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  LaneStep,
  LaneState,
  ZetkinCall,
  SurveySubmissionData,
  Report,
  ZetkinCallPatchResponse,
  Step,
} from './types';
import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';
import { ZetkinEvent } from 'utils/types/zetkin';
import { SerializedError } from './hooks/useAllocateCall';

export interface CallStoreSlice {
  activeLaneIndex: number;
  upcomingEventsList: RemoteList<ZetkinEvent>;
  lanes: LaneState[];
  outgoingCalls: RemoteList<ZetkinCall>;
  queueHasError: SerializedError | null;
}

const initialState: CallStoreSlice = {
  activeLaneIndex: 0,
  lanes: [
    {
      callIsBeingAllocated: false,
      currentCallId: null,
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
      updateCallError: false,
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

      const lane = state.lanes[state.activeLaneIndex];
      lane.step = LaneStep.STATS;
      state.lanes[state.activeLaneIndex].submissionDataBySurveyId = {};
      state.lanes[state.activeLaneIndex].respondedEventIds = [];
      state.outgoingCalls.isLoading = false;
      state.lanes[state.activeLaneIndex].callIsBeingAllocated = false;
    },
    allocateNewCall: (state) => {
      state.lanes[state.activeLaneIndex].callIsBeingAllocated = true;
    },
    allocatePreviousCall: (state, action: PayloadAction<ZetkinCall>) => {
      const newCall = action.payload;
      state.queueHasError = null;

      const currentLaneIndex = state.activeLaneIndex;
      const currentLane = state.lanes[currentLaneIndex];

      if (currentLane && currentLane.currentCallId == null) {
        const filteredLanes = state.lanes.filter(
          (lane) => lane.currentCallId !== null
        );

        state.lanes = filteredLanes;
      }

      const newLane = {
        callIsBeingAllocated: false,
        currentCallId: newCall.id,
        previousCall: null,
        report: {
          callBackAfter: null,
          callerLog: '',
          completed: false,
          failureReason: null,
          leftMessage: false,
          organizerActionNeeded: false,
          organizerLog: '',
          step: 'successOrFailure' as Step,
          success: false,
          targetCouldTalk: false,
          wrongNumber: null,
        },
        respondedEventIds: [],
        step: LaneStep.PREPARE,
        submissionDataBySurveyId: {},
        surveySubmissionError: false,
        updateCallError: false,
      };

      state.lanes.push(newLane);
      state.activeLaneIndex = state.lanes.length - 1;

      state.outgoingCalls.items.push(
        remoteItem(action.payload.id, {
          data: action.payload,
          isLoading: false,
          isStale: false,
          loaded: new Date().toISOString(),
        })
      );
    },
    callSkippedLoad: (state) => {
      state.lanes[state.activeLaneIndex].callIsBeingAllocated = true;
    },
    callSkippedLoaded: (state, action: PayloadAction<[number, ZetkinCall]>) => {
      const [skippedCallId, newCall] = action.payload;
      state.outgoingCalls.items = state.outgoingCalls.items.filter(
        (item) => item.id != skippedCallId
      );

      state.queueHasError = null;
      state.lanes[state.activeLaneIndex].currentCallId = newCall.id;

      state.outgoingCalls.items.push(
        remoteItem(newCall.id, {
          data: newCall,
          isLoading: false,
          isStale: false,
          loaded: new Date().toISOString(),
        })
      );

      const lane = state.lanes[state.activeLaneIndex];
      lane.step = LaneStep.PREPARE;

      state.lanes[state.activeLaneIndex].submissionDataBySurveyId = {};
      state.lanes[state.activeLaneIndex].respondedEventIds = [];
      state.lanes[state.activeLaneIndex].callIsBeingAllocated = false;
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
      state.lanes[state.activeLaneIndex].currentCallId = action.payload.id;
      state.queueHasError = null;

      state.outgoingCalls.items.push(
        remoteItem(action.payload.id, {
          data: action.payload,
          isLoading: false,
          isStale: false,
          loaded: new Date().toISOString(),
        })
      );

      const lane = state.lanes[state.activeLaneIndex];
      lane.step = LaneStep.PREPARE;
      state.lanes[state.activeLaneIndex].respondedEventIds = [];
      state.lanes[state.activeLaneIndex].submissionDataBySurveyId = {};
      state.lanes[state.activeLaneIndex].callIsBeingAllocated = false;
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
    quitCall: (state, action: PayloadAction<number>) => {
      const deletedCallId = action.payload;
      state.outgoingCalls.items = state.outgoingCalls.items.filter(
        (item) => item.id != deletedCallId
      );

      state.lanes[state.activeLaneIndex].currentCallId = null;

      const lane = state.lanes[state.activeLaneIndex];
      lane.step = LaneStep.STATS;

      state.lanes[state.activeLaneIndex].submissionDataBySurveyId = {};
      state.lanes[state.activeLaneIndex].respondedEventIds = [];
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
    reportSubmitted: (
      state,
      action: PayloadAction<ZetkinCallPatchResponse>
    ) => {
      state.lanes[state.activeLaneIndex].surveySubmissionError = false;
      state.lanes[state.activeLaneIndex].updateCallError = false;
      const updatedCall = action.payload;

      const callItem = state.outgoingCalls.items.find(
        (item) => item.id == updatedCall.id
      );

      if (callItem) {
        const data = callItem.data;

        if (data) {
          state.outgoingCalls.items = state.outgoingCalls.items.filter(
            (call) => call.id != updatedCall.id
          );
          state.outgoingCalls.items.push({
            ...callItem,
            data: {
              ...data,
              call_back_after: updatedCall.call_back_after,
              message_to_organizer: updatedCall.message_to_organizer,
              notes: updatedCall.notes,
              organizer_action_needed: updatedCall.organizer_action_needed,
              state: updatedCall.state,
              update_time: new Date().toISOString(),
            },
          });
        }
      }
    },
    reportUpdated: (state, action: PayloadAction<Report>) => {
      const report = action.payload;
      const lane = state.lanes[state.activeLaneIndex];
      lane.report = report;
    },
    setSurveySubmissionError: (state, action: PayloadAction<boolean>) => {
      state.lanes[state.activeLaneIndex].surveySubmissionError = action.payload;
      state.lanes[state.activeLaneIndex].updateCallError = false;
    },
    setUpdateCallError: (state, action: PayloadAction<boolean>) => {
      state.lanes[state.activeLaneIndex].updateCallError = action.payload;
      state.lanes[state.activeLaneIndex].surveySubmissionError = false;
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
    unfinishedCallAbandoned: (state, action: PayloadAction<number>) => {
      const abandonedCallId = action.payload;
      state.outgoingCalls.items = state.outgoingCalls.items.filter(
        (item) => item.id != abandonedCallId
      );
    },
    unfinishedCallSwitched: (state, action: PayloadAction<ZetkinCall>) => {
      const unfinishedCall = action.payload;

      const currentLaneIndex = state.activeLaneIndex;
      const currentLane = state.lanes[currentLaneIndex];

      if (currentLane && currentLane.currentCallId == null) {
        const filteredLanes = state.lanes.filter(
          (lane) => lane.currentCallId !== null
        );

        state.lanes = filteredLanes;
      }

      const unfinishedCallLineIndex = state.lanes.findIndex(
        (lane) => lane.currentCallId == unfinishedCall.id
      );
      const unfinishedCallLane = state.lanes.find(
        (lane) => lane.currentCallId == unfinishedCall.id
      );

      if (unfinishedCallLane && unfinishedCallLineIndex !== -1) {
        state.activeLaneIndex = unfinishedCallLineIndex;
      } else {
        const newLane = {
          callIsBeingAllocated: false,
          currentCallId: unfinishedCall.id,
          previousCall: null,
          report: {
            callBackAfter: null,
            callerLog: '',
            completed: false,
            failureReason: null,
            leftMessage: false,
            organizerActionNeeded: false,
            organizerLog: '',
            step: 'successOrFailure' as Step,
            success: false,
            targetCouldTalk: false,
            wrongNumber: null,
          },
          respondedEventIds: [],
          step: LaneStep.PREPARE,
          submissionDataBySurveyId: {},
          surveySubmissionError: false,
          updateCallError: false,
        };

        state.lanes.push(newLane);
        state.activeLaneIndex = state.lanes.length - 1;
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
  callSkippedLoad,
  callSkippedLoaded,
  clearReport,
  eventsLoad,
  eventsLoaded,
  allocateCallError,
  eventResponseAdded,
  eventResponseRemoved,
  allocatePreviousCall,
  allocateNewCall,
  newCallAllocated,
  outgoingCallsLoad,
  outgoingCallsLoaded,
  previousCallAdd,
  previousCallClear,
  quitCall,
  reportSubmitted,
  reportUpdated,
  setSurveySubmissionError,
  setUpdateCallError,
  surveySubmissionAdded,
  surveySubmissionDeleted,
  updateLaneStep,
  unfinishedCallAbandoned,
  unfinishedCallSwitched,
} = CallSlice.actions;
