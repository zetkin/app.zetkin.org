import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dayjs } from 'dayjs';
import { DateRange } from '@mui/x-date-pickers-pro';

import {
  LaneStep,
  LaneState,
  ZetkinCall,
  SurveySubmissionData,
  Report,
  ZetkinCallPatchResponse,
} from './types';
import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';
import { ZetkinCallAssignment, ZetkinEvent } from 'utils/types/zetkin';
import { SerializedError } from './hooks/useAllocateCall';

type ActivityFilters = {
  customDatesToFilterEventsBy: DateRange<Dayjs>;
  eventDateFilterState: 'today' | 'tomorrow' | 'thisWeek' | 'custom' | null;
  filterState: {
    alreadyIn: boolean;
    events: boolean;
    surveys: boolean;
    thisCall: boolean;
  };
  orgIdsToFilterEventsBy: number[];
  projectIdsToFilterActivitiesBy: (number | 'noProject')[];
};

export interface CallStoreSlice {
  activeLaneIndex: number;
  filters: ActivityFilters;
  upcomingEventsList: RemoteList<ZetkinEvent>;
  lanes: LaneState[];
  myAssignmentsList: RemoteList<ZetkinCallAssignment>;
  outgoingCalls: RemoteList<ZetkinCall>;
  queueHasError: SerializedError | null;
  selectedSurveyId: number | null;
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
  filters: emptyFilters,
  lanes: [],
  myAssignmentsList: remoteList(),
  outgoingCalls: remoteList(),
  queueHasError: null,
  selectedSurveyId: null,
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
      lane.step = LaneStep.START;
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
          previousCall: null,
          report: emptyReport,
          respondedEventIds: [],
          step: LaneStep.CALL,
          submissionDataBySurveyId: {},
          surveySubmissionError: false,
          updateCallError: false,
        };

        state.lanes.push(newLane);
        state.activeLaneIndex = state.lanes.length - 1;
      }

      state.filters = emptyFilters;
      state.selectedSurveyId = null;

      state.outgoingCalls.items.push(
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
      lane.step = LaneStep.CALL;

      state.lanes[state.activeLaneIndex].submissionDataBySurveyId = {};
      state.lanes[state.activeLaneIndex].respondedEventIds = [];
      state.lanes[state.activeLaneIndex].callIsBeingAllocated = false;
      state.lanes[state.activeLaneIndex].report = emptyReport;
      state.filters = emptyFilters;
      state.selectedSurveyId = null;
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
    filtersUpdated: (
      state,
      action: PayloadAction<Partial<ActivityFilters>>
    ) => {
      const updatedFilters = action.payload;
      state.filters = { ...state.filters, ...updatedFilters };
    },
    initiateAssignment: (state, action: PayloadAction<number>) => {
      const assignmentId = action.payload;

      const existingLane = state.lanes.find(
        (lane) => lane.assignmentId == assignmentId
      );

      if (existingLane) {
        const indexOfExistingLane = state.lanes.indexOf(existingLane);
        state.activeLaneIndex = indexOfExistingLane;
      } else {
        const newLane = {
          assignmentId: assignmentId,
          callIsBeingAllocated: false,
          currentCallId: null,
          previousCall: null,
          report: emptyReport,
          respondedEventIds: [],
          step: LaneStep.START,
          submissionDataBySurveyId: {},
          surveySubmissionError: false,
          updateCallError: false,
        };

        state.lanes.push(newLane);
        state.activeLaneIndex = state.lanes.length - 1;
      }
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
      lane.step = LaneStep.CALL;
      state.lanes[state.activeLaneIndex].respondedEventIds = [];
      state.lanes[state.activeLaneIndex].submissionDataBySurveyId = {};
      state.lanes[state.activeLaneIndex].callIsBeingAllocated = false;
      state.lanes[state.activeLaneIndex].report = emptyReport;
      state.filters = emptyFilters;
      state.selectedSurveyId = null;
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
      lane.step = LaneStep.START;

      state.lanes[state.activeLaneIndex].submissionDataBySurveyId = {};
      state.lanes[state.activeLaneIndex].respondedEventIds = [];
      state.lanes[state.activeLaneIndex].report = emptyReport;
      state.filters = emptyFilters;
      state.selectedSurveyId = null;
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
          sortOutgoingCalls(state.outgoingCalls);
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
    surveyDeselected: (state) => {
      state.selectedSurveyId = null;
    },
    surveySelected: (state, action: PayloadAction<number>) => {
      state.selectedSurveyId = action.payload;
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
      state.selectedSurveyId = null;
    },
    unfinishedCallAbandoned: (state, action: PayloadAction<number>) => {
      const abandonedCallId = action.payload;
      state.outgoingCalls.items = state.outgoingCalls.items.filter(
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
    unfinishedCallSwitched: (
      state,
      action: PayloadAction<[number, number]>
    ) => {
      const [unfinishedCallId, unfinishedCallAssignmentId] = action.payload;

      const currentLaneIndex = state.activeLaneIndex;
      const currentLane = state.lanes[currentLaneIndex];

      if (currentLane && currentLane.currentCallId == null) {
        const filteredLanes = state.lanes.filter(
          (lane) => lane.currentCallId !== null
        );

        state.lanes = filteredLanes;
      }

      const indexOfExistingLane = state.lanes.findIndex(
        (lane) => lane.currentCallId == unfinishedCallId
      );
      if (indexOfExistingLane != -1) {
        state.activeLaneIndex = indexOfExistingLane;
      } else {
        const newLane = {
          assignmentId: unfinishedCallAssignmentId,
          callIsBeingAllocated: false,
          currentCallId: unfinishedCallId,
          previousCall: null,
          report: emptyReport,
          respondedEventIds: [],
          step: LaneStep.CALL,
          submissionDataBySurveyId: {},
          surveySubmissionError: false,
          updateCallError: false,
        };

        state.lanes.push(newLane);
        state.activeLaneIndex = state.lanes.length - 1;
      }

      state.filters = emptyFilters;
      state.selectedSurveyId = null;

      sortOutgoingCalls(state.outgoingCalls);
    },
    updateLaneStep: (state, action: PayloadAction<LaneStep>) => {
      const step = action.payload;

      const lane = state.lanes[state.activeLaneIndex];
      lane.step = step;
    },
  },
});

const sortOutgoingCalls = (list: RemoteList<ZetkinCall>) => {
  list.items.sort((a, b) => {
    if (a.data && b.data) {
      return (
        new Date(b.data.update_time).getTime() -
        new Date(a.data.update_time).getTime()
      );
    }
    return 0;
  });
};

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
  initiateAssignment,
  myAssignmentsLoaded,
  myAssignmentsLoad,
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
  surveyDeselected,
  surveySelected,
  setSurveySubmissionError,
  setUpdateCallError,
  surveySubmissionAdded,
  surveySubmissionDeleted,
  updateLaneStep,
  unfinishedCallAbandoned,
  unfinishedCallSwitched,
} = CallSlice.actions;
