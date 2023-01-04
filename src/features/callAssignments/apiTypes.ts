import { ZetkinQuery, ZetkinTag } from 'utils/types/zetkin';

export interface CallAssignmentCaller {
  id: number;
  first_name: string;
  last_name: string;
  prioritized_tags: ZetkinTag[];
  excluded_tags: ZetkinTag[];
}

export interface CallAssignmentData {
  cooldown: number;
  disable_caller_notes: boolean;
  end_date: string | null;
  expose_target_details: boolean;
  goal: ZetkinQuery;
  id: number;
  instructions: string;
  start_date: string | null;
  target: ZetkinQuery;
  title: string;
}

export interface CallAssignmentStats {
  id: number;
  allTargets: number;
  allocated: number;
  blocked: number;
  callBackLater: number;
  calledTooRecently: number;
  done: number;
  missingPhoneNumber: number;
  mostRecentCallTime: string | null;
  organizerActionNeeded: number;
  queue: number;
  ready: number;
}
