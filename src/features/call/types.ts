import { ZetkinEvent, ZetkinPerson, ZetkinTag } from 'utils/types/zetkin';

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
  target: ZetkinTarget;
  update_time: string;
};

type ZetkinCaller = {
  id: number;
  name: string;
};

type ZetkinTarget = Pick<
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
  action_responses: [];
  call_log: [];
  future_actions: [];
  name: string;
  past_actions: {
    last_action: ZetkinEvent;
    num_actions: number;
  };
  tags: ZetkinTag[];
};
