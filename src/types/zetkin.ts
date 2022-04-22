import { ZetkinAssignedTask, ZetkinTask } from './tasks';
import { ZetkinQuery, ZetkinSmartSearchFilter } from './smartSearch';
import { ZetkinView, ZetkinViewColumn, ZetkinViewRow } from './views';

export interface ZetkinCampaign {
  color: string;
  info_text: string;
  title: string;
  id: number;
  organization?: ZetkinOrganization;
  manager: null | {
    id: number;
    name: string;
  };
  visibility: string;
  published: boolean;
}

export interface ZetkinMembership {
  organization: ZetkinOrganization;
  follow?: boolean;
  profile: {
    id: number;
    name: string;
  };
  inherited?: false;
  role: string | null;
}

export interface ZetkinEventResponse {
  action_id: number;
  id: number;
  person: {
    id: number;
    name: string;
  };
  response_date: string;
}

export interface ZetkinEvent {
  activity: { title: string };
  campaign: {
    id: number;
    title: string;
  };
  contact?: string | null;
  end_time: string;
  id: number;
  info_text: string;
  location: {
    id: number;
    lat: number;
    lng: number;
    title: string;
  };
  num_participants_required?: number;
  num_participants_available?: number;
  start_time: string;
  title?: string;
  organization: {
    id: number;
    title: string;
  };
  userBooked?: boolean;
  userResponse?: boolean;
  url?: string;
}

export interface ZetkinUser {
  first_name: string;
  id: number;
  is_superuser?: boolean;
  last_name: string;
  username: string;
}

export interface ZetkinOrganization {
  id: number;
  title: string;
}

export interface ZetkinPerson {
  alt_phone: string;
  is_user: boolean;
  zip_code: string;
  last_name: string;
  city: string;
  first_name: string;
  gender: string;
  street_address: string;
  co_address: string;
  ext_id: string;
  email: string;
  country: string;
  id: number;
  phone: string;
}

export interface ZetkinSession {
  created: string;
  level: number;
  user: ZetkinUser;
}

export interface ZetkinCallAssignment {
  cooldown: number;
  description: string;
  disable_caller_notes: boolean;
  end_date: string;
  goal: ZetkinQuery;
  id: number;
  instructions: string;
  organization: {
    id: number;
    title: string;
  };
  organization_id: number;
  start_date: string;
  target: ZetkinQuery;
  title: string;
}

export interface ZetkinSurvey {
  title: string;
  id: number;
  info_text: string;
  organization: {
    id: number;
    title: string;
  };
  allow_anonymous: boolean;
  access: string;
  callers_only: boolean;
}

export interface ZetkinSurveyExtended extends ZetkinSurvey {
  elements: ZetkinSurveyElement[];
}

export interface ZetkinSurveyElement {
  id: number;
  question: ZetkinQuestion;
  type: ELEMENT_TYPE;
}

export enum RESPONSE_TYPE {
  OPTIONS = 'options',
  TEXT = 'text',
}

export enum ELEMENT_TYPE {
  QUESTION = 'question',
  TEXT = 'text',
}

interface ZetkinQuestion {
  description: string | null;
  options?: ZetkinSurveyOption[];
  question: string;
  required: boolean;
  response_config: {
    multiline: boolean;
  };
  response_type: RESPONSE_TYPE;
}

export interface ZetkinSurveyOption {
  id: number;
  text: string;
}

export interface ZetkinCanvassAssignment {
  start_data: string;
  end_date: string;
  description: string;
  organization: {
    id: string;
    title: string;
  };
  instructions: string;
  id: string;
  title: string;
}

export interface ZetkinLocation {
  id: number;
  lat: number;
  lng: number;
  title: string;
  info_text: string;
}

export interface ZetkinActivity {
  id: number;
  title: string;
  info_text: string | null;
}

export interface ZetkinTag {
  id: number;
  title: string;
  description: string;
  hidden: boolean;
  organization: ZetkinOrganization;
  color: string | null;
  group: { id: number; title: string } | null;
  value?: string | number;
}

export enum CUSTOM_FIELD_TYPE {
  URL = 'url',
  DATE = 'date',
  TEXT = 'text',
  JSON = 'json',
}

export interface ZetkinDataField {
  id: number;
  title: string;
  description: string;
  type: CUSTOM_FIELD_TYPE;
  slug: string;
}

export type {
  ZetkinTask,
  ZetkinAssignedTask,
  ZetkinQuery,
  ZetkinSmartSearchFilter,
};

export type { ZetkinView, ZetkinViewColumn, ZetkinViewRow };

export interface ZetkinJourney {
  id: number;
  organization: ZetkinOrganization;
  plural_label: string;
  singular_label: string;
  stats: {
    closed: number;
    open: number;
  };
}

export interface ZetkinJourneyInstance {
  assignees: ZetkinPerson[];
  closed: string | null;
  created: string;
  id: number;
  journey: {
    id: number;
    title: string;
  };
  // `milestones` only available when instance is retrieved
  // as item, not when retrieved as collection
  milestones?: ZetkinJourneyMilestoneStatus[] | null;
  next_milestone: ZetkinJourneyMilestoneStatus | null;
  organization: {
    id: number;
    title: string;
  };
  subjects: ZetkinPerson[];
  summary: string;
  tags: Pick<ZetkinTag, 'id' | 'title' | 'group' | 'color' | 'value'>[];
  title?: string;
  updated: string;
}

export interface ZetkinJourneyMilestone {
  description: string;
  title: string;
}

export interface ZetkinJourneyMilestoneStatus {
  completed: string | null;
  deadline: string | null;
  description: string;
  title: string;
}

export type ZetkinUpdateAssignee = {
  assignee: Pick<ZetkinPerson, 'id' | 'first_name' | 'last_name'>;
};

export interface ZetkinUpdate {
  actor?: Pick<ZetkinPerson, 'id' | 'first_name' | 'last_name'>;
  created_at: string;
  details: ZetkinUpdateAssignee;
  type: 'journeyInstance.assignee.add';
  target: { id: number; title: string };
}
