import { ZetkinTag } from 'utils/types/zetkin';

export type ZetkinAction = {
  activity: {
    id: number;
    title: string | null;
  };
  campaign: {
    id: number;
    title: string;
  };
  cancelled: string | null;
  cancelled_by_user: string | null;
  contact: {
    id: number;
    name: string;
  };
  cover_file: string | null;
  end_time: string;
  id: number;
  info_text: string;
  location: {
    id: number;
    lat: number;
    lng: number;
    title: string;
  };
  num_participants_available: number;
  num_participants_required: number;
  organization: {
    id: number;
    title: string;
  };
  published: string;
  published_by_user: {
    first_name: string;
    id: number;
    last_name: string;
  };
  start_time: string;
  title: string | null;
  url: string;
};

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
    last_action: ZetkinAction;
    num_actions: number;
  };
  phone: string;
  tags: ZetkinTag[];
  zip_code: string | null;
};
