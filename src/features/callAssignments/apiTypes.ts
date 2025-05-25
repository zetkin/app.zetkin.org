import { ZetkinAppliedTag, ZetkinCallAssignment } from 'utils/types/zetkin';

export interface CallAssignmentCaller {
  id: number;
  first_name: string;
  last_name: string;
  prioritized_tags: ZetkinAppliedTag[];
  excluded_tags: ZetkinAppliedTag[];
}

// TODO: Consolidate these
export type CallAssignmentData = ZetkinCallAssignment;

export type CallAssignmentPatchBody = Partial<
  CallAssignmentData & {
    campaign_id?: number;
  }
>;

export type ZetkinCallAssignmentStats = {
  num_blocked: {
    allocated: number;
    any: number;
    call_back_after: number;
    cooldown: number;
    no_number: number;
    organizer_action_needed: number;
  };
  num_calls_made: number;
  num_calls_reached: number;
  num_goal_matches: number;
  num_remaining_targets: number;
  num_target_matches: number;
};

export interface CallAssignmentStats {
  id: number;
  allTargets: number;
  allocated: number;
  blocked: number;
  callBackLater: number;
  calledTooRecently: number;
  callsMade: number;
  done: number;
  missingPhoneNumber: number;
  mostRecentCallTime: string | null;
  organizerActionNeeded: number;
  queue: number;
  ready: number;
}

export interface Call {
  id: number;
  allocation_time: string;
  update_time: string;
  state: number;
  notes?: string;
  call_back_after?: string;
  organizer_action_needed: boolean;
  organizer_action_taken: boolean;
  message_to_organizer: string;
  assignment_id: number;
  caller: {
    first_name?: string;
    id: number;
    last_name?: string;
    name: string;
  };
  target: {
    alt_phone: string;
    id: number;
    name: string;
    phone: string;
  };
}
