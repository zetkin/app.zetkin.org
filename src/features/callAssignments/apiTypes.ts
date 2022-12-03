import { ZetkinQuery } from 'utils/types/zetkin';

export interface CallAssignmentData {
  cooldown: number;
  end_date?: string;
  id: number;
  start_date?: string;
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
