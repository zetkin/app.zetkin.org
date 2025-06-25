import {
  ZetkinEvent,
  ZetkinEventResponse,
  ZetkinPerson,
  ZetkinTag,
} from 'utils/types/zetkin';

export type ZetkinCall = {
  allocation_time: string;
  assignment_id: number;
  call_back_after: string | null;
  caller: ZetkinCaller;
  id: number;
  message_to_organizer: string | null;
  notes: string | null;
  organizer_action_needed: boolean;
  organizer_action_taken: string | null;
  state: number;
  target: ZetkinCallTarget;
  update_time: string;
};

type ZetkinCaller = {
  id: number;
  name: string;
};

export type ZetkinCallTarget = ZetkinPerson & {
  action_responses: CombinedEventResponse[];
  call_log: ZetkinCall[];
  future_actions: ZetkinEvent[];
  name: string;
  past_actions: {
    last_action: ZetkinEvent | null;
    num_actions: number;
  };
  tags: ZetkinTag[];
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
  STATS = 0,
  PREPARE = 1,
  ONGOING = 2,
  REPORT = 3,
  SUMMARY = 4,
}

export type SurveySubmissionData = Record<string, string | string[]>;

export type LaneState = {
  previousCall: ZetkinCall | null;
  report: CallReport | null;
  respondedEventIds: number[];
  step: LaneStep;
  submissionDataBySurveyId: Record<number, SurveySubmissionData>;
  surveySubmissionError: boolean;
};
