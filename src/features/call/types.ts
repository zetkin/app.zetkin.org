import { ZetkinEvent, ZetkinTag } from 'utils/types/zetkin';

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

type ZetkinTarget = {
  action_responses: [];
  alt_phone: string | null;
  call_log: [];
  city: string | null;
  email: string;
  ext_id: string;
  first_name: string;
  future_actions: [];
  id: number;
  last_name: string;
  name: string;
  past_actions: {
    last_action: ZetkinEvent;
    num_actions: number;
  };
  phone: string;
  tags: ZetkinTag[];
  zip_code: string | null;
};
