import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  LaneStep,
  LaneState,
  SurveySubmissionData,
  Report,
  ZetkinUpdatedCall,
  ActivityFilters,
  FinishedCall,
  UnfinishedCall,
  ReportSubmissionError,
} from './types';
import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';
import { ZetkinCallAssignment, ZetkinEvent } from 'utils/types/zetkin';
import { SerializedError } from './hooks/useAllocateCall';

export interface CallStoreSlice {
  activeLaneIndex: number;
  finishedCallsByOrgId: Record<number, RemoteList<FinishedCall>>;
  upcomingEventsByOrgId: Record<number, RemoteList<ZetkinEvent>>;
  lanes: LaneState[];
  myAssignmentsList: RemoteList<ZetkinCallAssignment>;
  unfinishedCallsByOrgId: Record<number, RemoteList<UnfinishedCall>>;
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
  finishedCallsByOrgId: {},
  lanes: [],
  myAssignmentsList: remoteList(),
  queueError: null,
  unfinishedCallsByOrgId: {},
  upcomingEventsByOrgId: {},
};

const CallSlice = createSlice({
  initialState,
  name: 'call',
  reducers: {
    allocateCallError: (
      state,
      action: PayloadAction<[number, SerializedError]>
    ) => {
      const [orgId, error] = action.payload;
      state.queueError = error;

      const lane = state.lanes[state.activeLaneIndex];
      lane.step = LaneStep.START;
      lane.submissionDataBySurveyId = {};
      lane.respondedEventIds = [];
      lane.callIsBeingAllocated = false;
      if (!state.unfinishedCallsByOrgId[orgId]) {
        state.unfinishedCallsByOrgId[orgId] = remoteList();
      }
      state.unfinishedCallsByOrgId[orgId].isLoading = false;
    },
    allocateNewCall: (state) => {
      state.lanes[state.activeLaneIndex].callIsBeingAllocated = true;
    },
    allocatePreviousCall: (
      state,
      action: PayloadAction<[number, UnfinishedCall]>
    ) => {
      const [orgId, newCall] = action.payload;
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
          pendingOrgLog: '',
          previousCall: null,
          report: emptyReport,
          reportSubmissionError: null,
          respondedEventIds: [],
          selectedSurveyId: null,
          step: LaneStep.CALL,
          submissionDataBySurveyId: {},
        };

        state.lanes.push(newLane);
        state.activeLaneIndex = state.lanes.length - 1;
      }

      if (!state.unfinishedCallsByOrgId[orgId]) {
        state.unfinishedCallsByOrgId[orgId] = remoteList();
      }
      state.unfinishedCallsByOrgId[orgId].items.push(
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
      action: PayloadAction<[number, number, UnfinishedCall]>
    ) => {
      const [orgId, skippedCallId, newCall] = action.payload;
      if (!state.unfinishedCallsByOrgId[orgId]) {
        state.unfinishedCallsByOrgId[orgId] = remoteList();
      }
      state.unfinishedCallsByOrgId[orgId].items = state.unfinishedCallsByOrgId[
        orgId
      ].items.filter((item) => item.id != skippedCallId);

      state.queueError = null;

      const activeLane = state.lanes[state.activeLaneIndex];
      activeLane.currentCallId = newCall.id;

      state.unfinishedCallsByOrgId[orgId].items.push(
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
    eventsLoad: (state, action: PayloadAction<number>) => {
      const orgId = action.payload;
      if (!state.upcomingEventsByOrgId[orgId]) {
        state.upcomingEventsByOrgId[orgId] = remoteList();
      }
      state.upcomingEventsByOrgId[orgId].isLoading = true;
    },
    eventsLoaded: (state, action: PayloadAction<[number, ZetkinEvent[]]>) => {
      const [orgId, events] = action.payload;
      state.upcomingEventsByOrgId[orgId] = remoteList(events);
      state.upcomingEventsByOrgId[orgId].loaded = new Date().toISOString();
    },
    filtersUpdated: (
      state,
      action: PayloadAction<Partial<ActivityFilters>>
    ) => {
      const updatedFilters = action.payload;

      const lane = state.lanes[state.activeLaneIndex];
      lane.filters = { ...lane.filters, ...updatedFilters };
    },
    finishedCallsLoad: (state, action: PayloadAction<number>) => {
      const orgId = action.payload;
      if (!state.finishedCallsByOrgId[orgId]) {
        state.finishedCallsByOrgId[orgId] = remoteList();
      }
      state.finishedCallsByOrgId[orgId].isLoading = true;
    },
    finishedCallsLoaded: (
      state,
      action: PayloadAction<[number, FinishedCall[]]>
    ) => {
      const [orgId, calls] = action.payload;
      state.finishedCallsByOrgId[orgId] = remoteList(calls);
      state.finishedCallsByOrgId[orgId].loaded = new Date().toISOString();
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
          pendingOrgLog: '',
          previousCall: null,
          report: emptyReport,
          reportSubmissionError: null,
          respondedEventIds: [],
          selectedSurveyId: null,
          step: LaneStep.START,
          submissionDataBySurveyId: {},
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
    newCallAllocated: (
      state,
      action: PayloadAction<[number, UnfinishedCall]>
    ) => {
      const [orgId, newCall] = action.payload;
      const lane = state.lanes[state.activeLaneIndex];
      lane.currentCallId = newCall.id;
      state.queueError = null;

      if (!state.unfinishedCallsByOrgId[orgId]) {
        state.unfinishedCallsByOrgId[orgId] = remoteList();
      }
      state.unfinishedCallsByOrgId[orgId].items.push(
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
    previousCallClear: (state) => {
      state.lanes[state.activeLaneIndex].previousCall = null;
    },
    quitCall: (state, action: PayloadAction<[number, number]>) => {
      const [orgId, deletedCallId] = action.payload;
      const lane = state.lanes[state.activeLaneIndex];

      if (!state.unfinishedCallsByOrgId[orgId]) {
        state.unfinishedCallsByOrgId[orgId] = remoteList();
      }
      state.unfinishedCallsByOrgId[orgId].items = state.unfinishedCallsByOrgId[
        orgId
      ].items.filter((item) => item.id != deletedCallId);

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
      action: PayloadAction<[number, ZetkinUpdatedCall]>
    ) => {
      const lane = state.lanes[state.activeLaneIndex];
      lane.reportSubmissionError = null;
      const [orgId, updatedCall] = action.payload;
      lane.previousCall = updatedCall;

      if (!state.unfinishedCallsByOrgId[orgId]) {
        state.unfinishedCallsByOrgId[orgId] = remoteList();
      }
      const callItem = state.unfinishedCallsByOrgId[orgId].items.find(
        (item) => item.id == updatedCall.id
      );

      if (callItem) {
        const data = callItem.data;

        if (data) {
          state.unfinishedCallsByOrgId[orgId].items =
            state.unfinishedCallsByOrgId[orgId].items.filter(
              (call) => call.id != updatedCall.id
            );

          if (!state.finishedCallsByOrgId[orgId]) {
            state.finishedCallsByOrgId[orgId] = remoteList();
          }
          state.finishedCallsByOrgId[orgId].items.push({
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
    setReportSubmissionError: (
      state,
      action: PayloadAction<ReportSubmissionError>
    ) => {
      const lane = state.lanes[state.activeLaneIndex];
      lane.reportSubmissionError = action.payload;
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
          pendingOrgLog: '',
          previousCall: null,
          report: emptyReport,
          reportSubmissionError: null,
          respondedEventIds: [],
          selectedSurveyId: null,
          step: LaneStep.CALL,
          submissionDataBySurveyId: {},
        };

        state.lanes.push(newLane);
        const indexOfNewLane = state.lanes.length - 1;
        state.activeLaneIndex = indexOfNewLane;
      }
    },
    unfinishedCallAbandoned: (
      state,
      action: PayloadAction<[number, number]>
    ) => {
      const [orgId, abandonedCallId] = action.payload;

      if (!state.unfinishedCallsByOrgId[orgId]) {
        state.unfinishedCallsByOrgId[orgId] = remoteList();
      }
      state.unfinishedCallsByOrgId[orgId].items = state.unfinishedCallsByOrgId[
        orgId
      ].items.filter((item) => item.id != abandonedCallId);

      const indexOfLaneWhereAbandonedCallIsCurrent = state.lanes.findIndex(
        (lane) => lane.currentCallId == abandonedCallId
      );

      if (indexOfLaneWhereAbandonedCallIsCurrent != -1) {
        state.lanes = state.lanes.filter(
          (lane) => lane.currentCallId != abandonedCallId
        );

        if (state.activeLaneIndex >= indexOfLaneWhereAbandonedCallIsCurrent) {
          const laneIndexAfterMove = state.activeLaneIndex - 1;
          state.activeLaneIndex =
            laneIndexAfterMove < 0 ? 0 : laneIndexAfterMove;
        }
      }
    },
    unfinishedCallsLoad: (state, action: PayloadAction<number>) => {
      const orgId = action.payload;
      if (!state.unfinishedCallsByOrgId[orgId]) {
        state.unfinishedCallsByOrgId[orgId] = remoteList();
      }
      state.unfinishedCallsByOrgId[orgId].isLoading = true;
    },
    unfinishedCallsLoaded: (
      state,
      action: PayloadAction<[number, UnfinishedCall[]]>
    ) => {
      const [orgId, calls] = action.payload;
      state.unfinishedCallsByOrgId[orgId] = remoteList(calls);
      state.unfinishedCallsByOrgId[orgId].loaded = new Date().toISOString();
    },
    updateLaneStep: (state, action: PayloadAction<LaneStep>) => {
      const step = action.payload;

      const lane = state.lanes[state.activeLaneIndex];
      lane.step = step;
    },
    updatePendingOrgLog: (state, action: PayloadAction<string>) => {
      const lane = state.lanes[state.activeLaneIndex];
      lane.pendingOrgLog = action.payload;
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
  previousCallClear,
  quitCall,
  reportSubmitted,
  reportUpdated,
  surveyDeselected,
  surveySelected,
  setReportSubmissionError,
  surveySubmissionAdded,
  surveySubmissionDeleted,
  updateLaneStep,
  unfinishedCallsLoad,
  unfinishedCallsLoaded,
  unfinishedCallAbandoned,
  switchedToUnfinishedCall,
  updatePendingOrgLog,
} = CallSlice.actions;
