import { EmailTheme } from 'features/emails/types';
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
  organization: ZetkinOrganization;
  manager: null | {
    id: number;
    name: string;
  };
  visibility: string;
  published: boolean;
}

export interface ZetkinCampaignPostBody
  extends Partial<Omit<ZetkinCampaign, 'organization' | 'manager'>> {
  title: string;
  manager_id?: number;
}

export interface ZetkinMembership {
  organization: Pick<ZetkinOrganization, 'id' | 'title'>;
  follow?: boolean;
  profile: {
    id: number;
    name: string;
  };
  inherited?: false;
  role: string | null;
}

export interface ZetkinOfficial {
  id: number;
  role: 'organizer' | 'admin';
  first_name: string;
  last_name: string;
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
  activity: {
    id: number;
    title: string;
  } | null;
  campaign: {
    id: number;
    title: string;
  } | null;
  cancelled: string | null;
  contact?: null | { id: number; name: string };
  cover_file: ZetkinFile | null;
  end_time: string;
  id: number;
  info_text: string;
  location: {
    id: number;
    lat: number;
    lng: number;
    title: string;
  } | null;
  num_participants_required: number;
  num_participants_available: number;
  published: string | null;
  start_time: string;
  title?: string | null;
  organization: {
    id: number;
    title: string;
  };
  url?: string;
}

export type ZetkinEventParticipant = ZetkinPerson & {
  attended: null | string;
  cancelled: null | string;
  noshow: null | string;
  reminder_sent: null | string;
};

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

export interface ZetkinOrganizerAction {
  assigment: {
    id: number;
    title: string;
  };
  caller: {
    first_name: string;
    id: number;
    last_name: string;
  };
  id: number;
  message_to_organizer: string;
  organizer_action_needed: boolean;
  organizer_action_taken: boolean;
  update_time: string;
}

export interface ZetkinUser {
  email: string;
  first_name: string;
  id: number;
  is_superuser?: boolean;
  lang: string | null;
  last_name: string;
  username: string;
}

export interface ZetkinOrganization {
  avatar_file: ZetkinFile | null;
  country: string;
  email: string | null;
  is_active: boolean;
  is_open: boolean;
  is_public: boolean;
  lang: string | null;
  parent: { id: number; title: string } | null;
  phone: string | null;
  slug: string | null;
  id: number;
  title: string;
}

export type ZetkinSubOrganization = ZetkinOrganization & {
  sub_orgs: ZetkinSubOrganization[];
};

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
  type: CUSTOM_FIELD_TYPE;
  organization: Pick<ZetkinOrganization, 'id' | 'title'>;
}

export interface ZetkinSession {
  created: string;
  level: number;
  user: ZetkinUser;
}

export interface ZetkinCallAssignment {
  campaign: {
    id: number;
    title: string;
  } | null;
  cooldown: number;
  description: string;
  disable_caller_notes: boolean;
  end_date: string | null;
  expose_target_details: boolean;
  goal: ZetkinQuery;
  id: number;
  instructions: string;
  organization: {
    id: number;
    title: string;
  };
  start_date: string | null;
  target: ZetkinQuery;
  title: string;
}

export type ZetkinCallAssignmentPartial = Partial<
  Omit<ZetkinCallAssignment, 'organization'>
>;

export interface ZetkinCallAssignmentPostBody
  extends ZetkinCallAssignmentPartial {
  goal_filters: [];
  target_filters: [];
}

export interface ZetkinSurvey {
  title: string;
  id: number;
  info_text: string;
  organization: {
    id: number;
    title: string;
  };
  access: string;
  callers_only: boolean;
  published: string | null;
  expires: string | null;
  campaign: { id: number; title: string } | null;
  org_access: 'sameorg' | 'suborgs';
  signature: 'require_signature' | 'allow_anonymous' | 'force_anonymous';
}

export interface ZetkinSurveyPostBody
  extends Partial<Omit<ZetkinSurvey, 'organization' | 'id'>> {
  title: string;
}

export interface ZetkinSurveyExtended extends ZetkinSurvey {
  elements: ZetkinSurveyElement[];
}

export interface ZetkinSurveyTextElement {
  hidden: boolean;
  id: number;
  text_block: {
    content: string;
    header: string;
  };
  type: ELEMENT_TYPE.TEXT;
}

export interface ZetkinSurveyTextQuestionElement {
  hidden: boolean;
  id: number;
  question: ZetkinTextQuestion;
  type: ELEMENT_TYPE.QUESTION;
}

export interface ZetkinSurveyOptionsQuestionElement {
  hidden: boolean;
  id: number;
  question: ZetkinOptionsQuestion;
  type: ELEMENT_TYPE.QUESTION;
}

export type ZetkinSurveyQuestionElement =
  | ZetkinSurveyOptionsQuestionElement
  | ZetkinSurveyTextQuestionElement;

export type ZetkinSurveyElement =
  | ZetkinSurveyTextElement
  | ZetkinSurveyQuestionElement;

export type ZetkinSurveyFormStatus =
  | 'editing'
  | 'invalid'
  | 'error'
  | 'submitted';

export type ZetkinSurveyApiSubmission = {
  responses: ZetkinSurveyQuestionResponse[];
  signature: ZetkinSurveySignaturePayload;
};

export enum RESPONSE_TYPE {
  OPTIONS = 'options',
  TEXT = 'text',
}

export type ZetkinSurveyElementOrder = {
  default: number[];
};

export enum ELEMENT_TYPE {
  QUESTION = 'question',
  TEXT = 'text',
}

export interface ZetkinTextQuestion {
  description: string | null;
  question: string;
  required: boolean;
  response_config: {
    multiline: boolean;
  };
  response_type: RESPONSE_TYPE.TEXT;
}

export interface ZetkinOptionsQuestion {
  description: string | null;
  options?: ZetkinSurveyOption[];
  question: string;
  required: boolean;
  response_config: {
    widget_type?: 'checkbox' | 'radio' | 'select';
  };
  response_type: RESPONSE_TYPE.OPTIONS;
}

export interface ZetkinSurveyOption {
  id: number;
  text: string;
}

export type ZetkinSurveyQuestionResponse =
  | {
      question_id: number;
      response: string;
    }
  | {
      options: number[];
      question_id: number;
    };

export type ZetkinSurveySignatureType = 'email' | 'user' | 'anonymous';

export type ZetkinSurveySignaturePayload =
  | null
  | 'user'
  | {
      email: string;
      first_name: string;
      last_name: string;
    };

export interface ZetkinSurveySubmission {
  id: number;
  organization: {
    id: number;
    title: string;
  };
  respondent: {
    email: string;
    first_name: string;
    id: number | null;
    last_name: string;
  } | null;
  survey: {
    id: number;
    title: string;
  };
  submitted: string;
  responses?: ZetkinSurveyQuestionResponse[]; // TODO: Lying! Segregate with/without responses
}

export interface ZetkinSurveySubmissionPatchBody
  extends Partial<Omit<ZetkinTag, 'organization' | 'respondent' | 'survey'>> {
  respondent_id: number | null;
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

export interface ZetkinEventTypePostBody {
  title: string;
}

export interface ZetkinTagGroup {
  id: number;
  title: string;
  description?: string;
  organization: Pick<ZetkinOrganization, 'id' | 'title'>;
}

export interface ZetkinTag {
  id: number;
  title: string;
  description: string;
  hidden: boolean;
  organization: Pick<ZetkinOrganization, 'id' | 'title'>;
  color: string | null;
  group: ZetkinTagGroup | null;
  value?: string | number | null;
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

export interface ZetkinEmail {
  campaign: { id: number; title: string } | null;
  theme: EmailTheme | null;
  id: number;
  locked: string | null;
  processed: string | null;
  published: string | null;
  subject: string | null;
  organization: { id: number; title: string };
  content: string | null;
  title: string | null;
  target: ZetkinQuery;
}

export interface ZetkinLink {
  email: { id: number; title: string };
  id: number;
  url: string;
  tag: string;
}

export type ZetkinEmailPostBody = Partial<
  Omit<ZetkinEmail, 'id' | 'theme' | 'published' | 'organization' | 'target'>
> & {
  campaign_id: number | null;
  theme_id: number | null;
};

export type ZetkinCreatePerson = Partial<
  Omit<ZetkinPersonNativeFields, 'id' | 'is_user'>
> &
  Record<string, string | null>;

export type ZetkinUpdatePerson = ZetkinCreatePerson;
