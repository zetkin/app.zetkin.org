import {
  ZetkinAssignedTask,
  ZetkinTask,
} from '../../features/tasks/components/types';
import {
  ZetkinQuery,
  ZetkinSmartSearchFilter,
} from '../../features/smartSearch/components/types';
import {
  ZetkinView,
  ZetkinViewColumn,
  ZetkinViewRow,
} from '../../features/views/components/types';

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

export interface ZetkinFile {
  id: number;
  original_name: string;
  uploaded: string;
  organization: {
    id: number;
    title: string;
  };
  url: string;
  mime_type: string;
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

export interface ZetkinPersonNativeFields {
  alt_phone: string | null;
  is_user: boolean;
  zip_code: string | null;
  last_name: string;
  city: string | null;
  first_name: string;
  gender: 'f' | 'm' | 'o' | null;
  street_address: string | null;
  co_address: string | null;
  ext_id: string | null;
  email: string | null;
  country: string | null;
  id: number;
  phone: string | null;
}

export type ZetkinPerson = ZetkinPersonNativeFields &
  Record<string, string | number | boolean | Record<string, unknown> | null>;

export interface ZetkinCustomField {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  type: 'text' | 'json' | 'date' | 'url';
  organization: Pick<ZetkinOrganization, 'id' | 'title'>;
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

export interface ZetkinTagGroup {
  id: number;
  title: string;
  description?: string;
  organization: ZetkinOrganization;
}

export interface ZetkinTag {
  id: number;
  title: string;
  description: string;
  hidden: boolean;
  organization: ZetkinOrganization;
  color: string | null;
  group: ZetkinTagGroup | null;
  value?: string | number;
  value_type: string | null;
}

export interface ZetkinTagPostBody
  extends Partial<Omit<ZetkinTag, 'id' | 'group' | 'organization'>> {
  title: string;
  group_id?: number | null;
}

export interface ZetkinTagPatchBody
  extends Partial<Omit<ZetkinTag, 'group' | 'organization'>> {
  id: number;
  group_id?: number | null;
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

export interface ZetkinJourney {
  id: number;
  opening_note_template: string;
  organization: ZetkinOrganization;
  plural_label: string;
  singular_label: string;
  stats: {
    closed: number;
    open: number;
  };
  title: string;
}

export interface ZetkinJourneyInstance {
  assignees: ZetkinPerson[];
  closed: string | null;
  created: string;
  id: number;
  journey: {
    id: number;
    plural_label: string;
    singular_label: string;
    title: string;
  };
  // `milestones` only available when instance is retrieved
  // as item, not when retrieved as collection
  milestones?: ZetkinJourneyMilestoneStatus[] | null;
  next_milestone: ZetkinJourneyMilestoneStatus | null;
  opening_note: string;
  organization: {
    id: number;
    title: string;
  };
  outcome: string;
  subjects: ZetkinPerson[];
  summary: string;
  tags: ZetkinTag[];
  title?: string;
  updated: string | null;
}

export interface ZetkinJourneyMilestone {
  id: number;
  title: string;
  description: string;
}

export interface ZetkinJourneyMilestoneStatus {
  completed: string | null;
  deadline: string | null;
  id: number;
  title: string;
  description: string;
}

export interface ZetkinNote {
  id: number;
  files: ZetkinFile[];
  text: string;
}

export interface ZetkinNoteBody {
  text: string;
  file_ids?: number[];
}

export type {
  ZetkinTask,
  ZetkinAssignedTask,
  ZetkinQuery,
  ZetkinSmartSearchFilter,
  ZetkinView,
  ZetkinViewColumn,
  ZetkinViewRow,
};
