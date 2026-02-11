import { DateRange } from '@mui/x-date-pickers-pro';
import { Dayjs } from 'dayjs';

import {
  ZetkinEvent,
  ZetkinEventResponse,
  ZetkinPerson,
  ZetkinTag,
} from 'utils/types/zetkin';

export enum CallState {
  UNFINISHED = 0,
  SUCCESSFUL = 1,
  NO_PICKUP = 11,
  LINE_BUSY = 12,
  CALL_BACK = 13,
  NOT_AVAILABLE = 14,
  LEFT_MESSAGE = 15,
  WRONG_NUMBER = 21,
}

type CallBase = {
  allocation_time: string;
  assignment_id: number;
  call_back_after: string | null;
  caller: ZetkinCaller;
  id: number;
  message_to_organizer: string | null;
  notes: string | null;
  organizer_action_needed: boolean;
  organizer_action_taken: string | null;
  target: ZetkinCallTarget;
  update_time: string;
};

export type UnfinishedCall = CallBase & {
  state: CallState.UNFINISHED;
};

export type FinishedCall = CallBase & {
  state:
    | CallState.SUCCESSFUL
    | CallState.CALL_BACK
    | CallState.LEFT_MESSAGE
    | CallState.LINE_BUSY
    | CallState.NOT_AVAILABLE
    | CallState.NO_PICKUP
    | CallState.WRONG_NUMBER;
};

export type ZetkinCall = UnfinishedCall | FinishedCall;

export type CallStateString =
  | 'success'
  | 'noResponse'
  | 'lineBusy'
  | 'callBack'
  | 'notAvailable'
  | 'leftMessage'
  | 'wrongNumber';

export const callStateToString: Record<FinishedCall['state'], CallStateString> =
  {
    [CallState.SUCCESSFUL]: 'success',
    [CallState.NO_PICKUP]: 'noResponse',
    [CallState.LINE_BUSY]: 'lineBusy',
    [CallState.CALL_BACK]: 'callBack',
    [CallState.NOT_AVAILABLE]: 'notAvailable',
    [CallState.LEFT_MESSAGE]: 'leftMessage',
    [CallState.WRONG_NUMBER]: 'wrongNumber',
  };

type ZetkinCaller = {
  id: number;
  name: string;
};

export type ZetkinCallTarget = ZetkinPerson & {
  action_responses: CombinedEventResponse[];
  call_log: FinishedCall[];
  future_actions: ZetkinEvent[];
  name: string;
  past_actions: {
    last_action: ZetkinEvent | null;
    num_actions: number;
  };
  tags: ZetkinTag[];
};

export type ZetkinCallPatchResponse = Omit<FinishedCall, 'target'> & {
  target: {
    alt_phone: string | null;
    id: number;
    name: string;
    phone: string;
  };
};

export type Step =
  | 'callBack'
  | 'callerLog'
  | 'couldTalk'
  | 'failureReason'
  | 'leftMessage'
  | 'organizerAction'
  | 'organizerLog'
  | 'successOrFailure'
  | 'summary'
  | 'wrongNumber';

export type Report = {
  callBackAfter: string | null;
  callerLog: string;
  completed: boolean;
  failureReason:
    | 'lineBusy'
    | 'noPickup'
    | 'wrongNumber'
    | 'notAvailable'
    | null;
  leftMessage: boolean;
  organizerActionNeeded: boolean;
  organizerLog: string;
  step: Step;
  success: boolean;
  targetCouldTalk: boolean;
  wrongNumber: 'altPhone' | 'phone' | 'both' | null;
};

export type CallReport = Pick<
  ZetkinCall,
  'message_to_organizer' | 'notes' | 'organizer_action_needed' | 'state'
> &
  Partial<Pick<ZetkinCall, 'call_back_after'>>;

export interface CombinedEventResponse extends ZetkinEventResponse {
  action: ZetkinEvent;
}

export enum LaneStep {
  START = 0,
  CALL = 1,
  REPORT = 2,
  SUMMARY = 3,
}

export type SurveySubmissionData = Record<string, string | string[]>;

export type ActivityFilters = {
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

export type LaneState = {
  assignmentId: number;
  callIsBeingAllocated: boolean;
  currentCallId: number | null;
  filters: ActivityFilters;
  previousCall: UnfinishedCall | null;
  report: Report;
  respondedEventIds: number[];
  selectedSurveyId: number | null;
  step: LaneStep;
  submissionDataBySurveyId: Record<number, SurveySubmissionData>;
  surveySubmissionError: boolean;
  updateCallError: boolean;
};
