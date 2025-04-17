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

export type ZetkinCallTarget = Pick<
  ZetkinPerson,
  | 'alt_phone'
  | 'city'
  | 'email'
  | 'ext_id'
  | 'first_name'
  | 'id'
  | 'last_name'
  | 'phone'
  | 'zip_code'
> & {
  action_responses: CombinedEventResponse[];
  call_log: [];
  future_actions: ZetkinEvent[];
  name: string;
  past_actions: {
    last_action: ZetkinEvent;
    num_actions: number;
  };
  tags: ZetkinTag[];
};

export type ZetkinCallPatchBody = {
  call_back_after?: string | null;
  message_to_organizer: string | null;
  notes: string | null;
  organizer_action_needed: boolean;
  state: number;
};

export interface CombinedEventResponse extends ZetkinEventResponse {
  action: ZetkinEvent;
}
