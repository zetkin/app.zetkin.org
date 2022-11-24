import { ZetkinQuery } from 'utils/types/zetkin';

export interface CallAssignmentData {
  cooldown: number;
  id: number;
  target: ZetkinQuery;
  title: string;
}

export interface CallAssignmentStats {
  allTargets: number;
  allocated: number;
  blocked: number;
  callBackLater: number;
  calledTooRecently: number;
  done: number;
  isStale: boolean;
  missingPhoneNumber: number;
  organizerActionNeeded: number;
  queue: number;
  ready: number;
  isLoading: boolean;
}
