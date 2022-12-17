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
  end_date: string | null;
  goal: ZetkinQuery;
  id: number;
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
