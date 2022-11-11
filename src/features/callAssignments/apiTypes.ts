export interface CallAssignmentData {
  id: number;
  target: CallAssignmentTargetData;
  title: string;
}

interface CallAssignmentTargetData {
  id: number;
  filter_spec: CallAssignmentFilter[] | null;
}

interface CallAssignmentFilter {
  id: number;
}

export interface CallAssignmentStats {
  allocated: number;
  blocked: number;
  callBackLater: number;
  calledTooRecently: number;
  done: number;
  missingPhoneNumber: number;
  organizerActionNeeded: number;
  queue: number;
  ready: number;
  isLoading: boolean;
}
