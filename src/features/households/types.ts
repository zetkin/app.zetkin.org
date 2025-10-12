import { ZetkinEvent, ZetkinPerson, ZetkinTag } from '../../utils/types/zetkin';
import { CombinedEventResponse } from '../call/types';
import { Zetkin2AreaLine } from '../areas/types';

export type ZetkinHousehold = {
  assignment_id: number;
  canvasser: ZetkinCanvasser;
  id: number;
  message_to_organizer: string | null;
  notes: string | null;
  organizer_action_needed: boolean;
  organizer_action_taken: string | null;
  state: number;
  target: ZetkinHouseholdTarget;
  update_time: string;
};

export type Zetkin2Area = {
  boundary: {
    coordinates: Zetkin2AreaLine[];
    type: 'Polygon';
  };
  description: string;
  id: number;
  organization_id: number;
  title: string;
};

type ZetkinCanvasser = {
  id: number;
  name: string;
};

export type ZetkinHouseholdTarget = ZetkinPerson & {
  action_responses: CombinedEventResponse[];
  future_actions: ZetkinEvent[];
  name: string;
  past_actions: {
    last_action: ZetkinEvent | null;
    num_actions: number;
  };
  tags: ZetkinTag[];
  visits_log: ZetkinHousehold[];
};

