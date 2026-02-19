import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  LaneStep,
  LaneState,
  SurveySubmissionData,
  Report,
  ZetkinCallPatchResponse,
  ActivityFilters,
  FinishedCall,
  UnfinishedCall,
} from './types';
import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';
import { ZetkinCallAssignment, ZetkinEvent } from 'utils/types/zetkin';
import { SerializedError } from './hooks/useAllocateCall';

export interface CallStoreSlice {
  activeLaneIndex: number;
  finishedCalls: RemoteList<FinishedCall>;
  upcomingEventsList: RemoteList<ZetkinEvent>;
  lanes: LaneState[];
  myAssignmentsList: RemoteList<ZetkinCallAssignment>;
  unfinishedCalls: RemoteList<UnfinishedCall>;
  queueError: SerializedError | null;
}

const emptyFilters: ActivityFilters = {
  customDatesToFilterEventsBy: [null, null],
  eventDateFilterState: null,
  filterState: {
    alreadyIn: false,
    events: false,
    surveys: false,
    thisCall: false,
  },
  orgIdsToFilterEventsBy: [],
  projectIdsToFilterActivitiesBy: [],
};

const emptyReport: Report = {
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

const initialState: CallStoreSlice = {
  activeLaneIndex: 0,
  finishedCalls: remoteList(),
  lanes: [],
  myAssignmentsList: remoteList(),
  queueError: null,
  unfinishedCalls: remoteList(),
  upcomingEventsList: remoteList(),
};

const CallSlice = createSlice({
  initialState,
  name: 'call',
  reducers: {
    allocateCallError: (state, action: PayloadAction<SerializedError>) => {
      const error = action.payload;
      state.queueError = error;

      const lane = state.lanes[state.activeLaneIndex];
      lane.step = LaneStep.START;
      lane.submissionDataBySurveyId = {};
      lane.respondedEventIds = [];
      lane.callIsBeingAllocated = false;
      state.unfinishedCalls.isLoading = false;
    },
    allocateNewCall: (state) => {
      state.lanes[state.activeLaneIndex].callIsBeingAllocated = true;
    },
    allocatePreviousCall: (state, action: PayloadAction<UnfinishedCall>) => {
      const newCall = action.payload;
      state.queueError = null;

      const currentLaneIndex = state.activeLaneIndex;
      const currentLane = state.lanes[currentLaneIndex];

      if (currentLane && currentLane.currentCallId == null) {
        const filteredLanes = state.lanes.filter(
          (lane) => lane.currentCallId !== null
        );

        state.lanes = filteredLanes;
      }

      const indexOfExistingLane = state.lanes.findIndex(
        (lane) => lane.currentCallId == newCall.id
      );
      if (indexOfExistingLane != -1) {
        state.activeLaneIndex = indexOfExistingLane;
      } else {
        const newLane = {
          assignmentId: newCall.assignment_id,
          callIsBeingAllocated: false,
          currentCallId: newCall.id,
          filters: emptyFilters,
          previousCall: null,
          report: emptyReport,
          respondedEventIds: [],
          selectedSurveyId: null,
          step: LaneStep.CALL,
          submissionDataBySurveyId: {},
          surveySubmissionError: false,
          updateCallError: false,
        };

        state.lanes.push(newLane);
        state.activeLaneIndex = state.lanes.length - 1;
      }

      state.unfinishedCalls.items.push(
        remoteItem(newCall.id, {
          data: newCall,
          isLoading: false,
          isStale: false,
          loaded: new Date().toISOString(),
        })
      );
    },
    callSkippedLoad: (state) => {
      state.lanes[state.activeLaneIndex].callIsBeingAllocated = true;
    },
    callSkippedLoaded: (
      state,
      action: PayloadAction<[number, UnfinishedCall]>
    ) => {
      const [skippedCallId, newCall] = action.payload;
      state.unfinishedCalls.items = state.unfinishedCalls.items.filter(
        (item) => item.id != skippedCallId
      );

      state.queueError = null;

      const activeLane = state.lanes[state.activeLaneIndex];
      activeLane.currentCallId = newCall.id;

      state.unfinishedCalls.items.push(
        remoteItem(newCall.id, {
          data: newCall,
          isLoading: false,
          isStale: false,
          loaded: new Date().toISOString(),
        })
      );

      activeLane.step = LaneStep.CALL;
      activeLane.submissionDataBySurveyId = {};
      activeLane.respondedEventIds = [];
      activeLane.callIsBeingAllocated = false;
      activeLane.report = emptyReport;
      activeLane.filters = emptyFilters;
      activeLane.selectedSurveyId = null;
    },
    clearReport: (state) => {
      state.lanes[state.activeLaneIndex].report = emptyReport;
    },
    eventResponseAdded: (state, action: PayloadAction<number>) => {
      const eventIdToAdd = action.payload;
      const eventIds = state.lanes[state.activeLaneIndex].respondedEventIds;
      eventIds.push(eventIdToAdd);
    },
    eventResponseRemoved: (state, action: PayloadAction<number>) => {
      const eventIdToRemove = action.payload;
      const lane = state.lanes[state.activeLaneIndex];
      const eventIds = lane.respondedEventIds;

      lane.respondedEventIds = eventIds.filter((id) => id != eventIdToRemove);
    },
    eventsLoad: (state) => {
      state.upcomingEventsList.isLoading = true;
    },
    eventsLoaded: (state, action: PayloadAction<ZetkinEvent[]>) => {
      state.upcomingEventsList = remoteList(action.payload);
      state.upcomingEventsList.loaded = new Date().toISOString();
    },
    filtersUpdated: (
      state,
      action: PayloadAction<Partial<ActivityFilters>>
    ) => {
      const updatedFilters = action.payload;

      const lane = state.lanes[state.activeLaneIndex];
      lane.filters = { ...lane.filters, ...updatedFilters };
    },
    finishedCallsLoad: (state) => {
      state.finishedCalls.isLoading = true;
    },
    finishedCallsLoaded: (state, action: PayloadAction<FinishedCall[]>) => {
      state.finishedCalls = remoteList(action.payload);
      state.finishedCalls.loaded = new Date().toISOString();
    },
    initiateAssignment: (
      state,
      action: PayloadAction<[number, LaneState[]]>
    ) => {
      const [assignmentId, lanes] = action.payload;

      const indexOfExistingLane = lanes.findIndex(
        (lane) => lane.assignmentId == assignmentId
      );

      if (indexOfExistingLane != -1) {
        state.lanes = lanes;
        state.activeLaneIndex = indexOfExistingLane;
      } else {
        const newLane = {
          assignmentId: assignmentId,
          callIsBeingAllocated: false,
          currentCallId: null,
          filters: emptyFilters,
          previousCall: null,
          report: emptyReport,
          respondedEventIds: [],
          selectedSurveyId: null,
          step: LaneStep.START,
          submissionDataBySurveyId: {},
          surveySubmissionError: false,
          updateCallError: false,
        };

        state.lanes.push(newLane);
        state.activeLaneIndex = state.lanes.length - 1;
      }
    },
    initiateWithoutAssignment: (
      state,
      action: PayloadAction<[number, LaneState[]]>
    ) => {
      const [activeLaneIndex, lanes] = action.payload;

      state.lanes = lanes;
      state.activeLaneIndex = activeLaneIndex;
    },
    myAssignmentsLoad: (state) => {
      state.myAssignmentsList.isLoading = true;
    },
    myAssignmentsLoaded: (
      state,
      action: PayloadAction<ZetkinCallAssignment[]>
    ) => {
      const assignments = action.payload;
      const timestamp = new Date().toISOString();

      state.myAssignmentsList = remoteList(assignments);
      state.myAssignmentsList.loaded = timestamp;
      state.myAssignmentsList.items.forEach(
        (item) => (item.loaded = timestamp)
      );
    },
    newCallAllocated: (state, action: PayloadAction<UnfinishedCall>) => {
      const newCall = action.payload;
      const lane = state.lanes[state.activeLaneIndex];
      lane.currentCallId = action.payload.id;
      state.queueError = null;

      state.unfinishedCalls.items.push(
        remoteItem(newCall.id, {
          data: newCall,
          isLoading: false,
          isStale: false,
          loaded: new Date().toISOString(),
        })
      );

      lane.step = LaneStep.CALL;
      lane.respondedEventIds = [];
      lane.submissionDataBySurveyId = {};
      lane.callIsBeingAllocated = false;
      lane.report = emptyReport;
      lane.filters = emptyFilters;
      lane.selectedSurveyId = null;
    },
    previousCallAdd: (state, action: PayloadAction<UnfinishedCall>) => {
      const call = action.payload;
      state.lanes[state.activeLaneIndex].previousCall = call;
    },
    previousCallClear: (state) => {
      state.lanes[state.activeLaneIndex].previousCall = null;
    },
    quitCall: (state, action: PayloadAction<number>) => {
      const deletedCallId = action.payload;
      const lane = state.lanes[state.activeLaneIndex];

      state.unfinishedCalls.items = state.unfinishedCalls.items.filter(
        (item) => item.id != deletedCallId
      );

      lane.currentCallId = null;
      lane.step = LaneStep.START;
      lane.submissionDataBySurveyId = {};
      lane.respondedEventIds = [];
      lane.report = emptyReport;
      lane.filters = emptyFilters;
      lane.selectedSurveyId = null;
    },

    reportSubmitted: (
      state,
      action: PayloadAction<ZetkinCallPatchResponse>
    ) => {
      const lane = state.lanes[state.activeLaneIndex];
      lane.surveySubmissionError = false;
      lane.updateCallError = false;
      const updatedCall = action.payload;

      const callItem = state.unfinishedCalls.items.find(
        (item) => item.id == updatedCall.id
      );

      if (callItem) {
        const data = callItem.data;

        if (data) {
          state.unfinishedCalls.items = state.unfinishedCalls.items.filter(
            (call) => call.id != updatedCall.id
          );
          state.finishedCalls.items.push({
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
      const lane = state.lanes[state.activeLaneIndex];
      lane.surveySubmissionError = action.payload;
      lane.updateCallError = false;
    },
    setUpdateCallError: (state, action: PayloadAction<boolean>) => {
      const lane = state.lanes[state.activeLaneIndex];
      lane.updateCallError = action.payload;
      lane.surveySubmissionError = false;
    },
    surveyDeselected: (state) => {
      const lane = state.lanes[state.activeLaneIndex];
      lane.selectedSurveyId = null;
    },
    surveySelected: (state, action: PayloadAction<number>) => {
      const lane = state.lanes[state.activeLaneIndex];
      lane.selectedSurveyId = action.payload;
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
      const lane = state.lanes[state.activeLaneIndex];
      const surveyId = action.payload;

      const responsesBySurveyId = lane.submissionDataBySurveyId;

      delete responsesBySurveyId[surveyId];
      lane.selectedSurveyId = null;
    },
    switchedToUnfinishedCall: (
      state,
      action: PayloadAction<[number, number]>
    ) => {
      const [unfinishedCallId, unfinishedCallAssignmentId] = action.payload;

      const currentLaneIndex = state.activeLaneIndex;
      const currentLane = state.lanes[currentLaneIndex];

      const weHaveNotStartedCallingInThisLane =
        currentLane && currentLane.currentCallId == null;
      if (weHaveNotStartedCallingInThisLane) {
        const lanesWithCalls = state.lanes.filter(
          (lane) => lane.currentCallId !== null
        );

        state.lanes = lanesWithCalls;
      }

      const indexOfLaneWithUnfinishedCall = state.lanes.findIndex(
        (lane) => lane.currentCallId == unfinishedCallId
      );

      const thereIsALaneWithTheUnfinishedCall =
        indexOfLaneWithUnfinishedCall != -1;

      if (thereIsALaneWithTheUnfinishedCall) {
        state.activeLaneIndex = indexOfLaneWithUnfinishedCall;
      } else {
        const newLane = {
          assignmentId: unfinishedCallAssignmentId,
          callIsBeingAllocated: false,
          currentCallId: unfinishedCallId,
          filters: emptyFilters,
          previousCall: null,
          report: emptyReport,
          respondedEventIds: [],
          selectedSurveyId: null,
          step: LaneStep.CALL,
          submissionDataBySurveyId: {},
          surveySubmissionError: false,
          updateCallError: false,
        };

        state.lanes.push(newLane);
        const indexOfNewLane = state.lanes.length - 1;
        state.activeLaneIndex = indexOfNewLane;
      }
    },
    unfinishedCallAbandoned: (state, action: PayloadAction<number>) => {
      const abandonedCallId = action.payload;
      state.unfinishedCalls.items = state.unfinishedCalls.items.filter(
        (item) => item.id != abandonedCallId
      );

      const indexOfLaneWithAbandonedCall = state.lanes.findIndex(
        (lane) => lane.currentCallId == abandonedCallId
      );
      if (indexOfLaneWithAbandonedCall != -1) {
        state.lanes.splice(indexOfLaneWithAbandonedCall, 1);

        if (state.activeLaneIndex >= indexOfLaneWithAbandonedCall) {
          state.activeLaneIndex = Math.max(0, state.activeLaneIndex - 1);
        }
      }
    },
    unfinishedCallsLoad: (state) => {
      state.unfinishedCalls.isLoading = true;
    },
    unfinishedCallsLoaded: (state, action: PayloadAction<UnfinishedCall[]>) => {
      state.unfinishedCalls = remoteList(action.payload);
      state.unfinishedCalls.loaded = new Date().toISOString();
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
  filtersUpdated,
  finishedCallsLoad,
  finishedCallsLoaded,
  initiateAssignment,
  initiateWithoutAssignment,
  myAssignmentsLoaded,
  myAssignmentsLoad,
  allocatePreviousCall,
  allocateNewCall,
  newCallAllocated,
  previousCallAdd,
  previousCallClear,
  quitCall,
  reportSubmitted,
  reportUpdated,
  surveyDeselected,
  surveySelected,
  setSurveySubmissionError,
  setUpdateCallError,
  surveySubmissionAdded,
  surveySubmissionDeleted,
  updateLaneStep,
  unfinishedCallsLoad,
  unfinishedCallsLoaded,
  unfinishedCallAbandoned,
  switchedToUnfinishedCall,
} = CallSlice.actions;
