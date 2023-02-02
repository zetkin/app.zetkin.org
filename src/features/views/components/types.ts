import { ZetkinOrganization } from 'utils/types/zetkin';
import {
  AnyFilterConfig,
  ZetkinQuery,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';

export interface ZetkinViewFolder {
  id: number;
  title: string;
  parent: null | {
    id: number;
    title: string;
  };
}

export interface ZetkinView {
  folder: null | {
    id: number;
    title: string;
  };
  id: number;
  title: string;
  description: string;
  created: string; // ISO Datetime
  content_query: null | Pick<ZetkinQuery, 'id' | 'filter_spec'>;
  owner: {
    id: number;
    name: string;
  };
  organization: ZetkinOrganization;
}

export interface ZetkinViewRow {
  id: number;
  content: unknown[];
}

export interface ZetkinViewColumnBase {
  id: number;
  type: COLUMN_TYPE;
  title: string;
  description?: string;
  config?: Record<string, unknown>;
}

export enum COLUMN_TYPE {
  JOURNEY_ASSIGNEE = 'journey_assignee',
  LOCAL_BOOL = 'local_bool',
  LOCAL_PERSON = 'local_person',
  LOCAL_SMART_SEARCH = 'local_query',
  LOCAL_TEXT = 'local_text',
  PERSON_FIELD = 'person_field',
  PERSON_NOTES = 'person_notes',
  PERSON_QUERY = 'person_query',
  PERSON_TAG = 'person_tag',
  SURVEY_OPTION = 'survey_option',
  SURVEY_OPTIONS = 'survey_options',
  SURVEY_RESPONSE = 'survey_response',
  SURVEY_SUBMITTED = 'survey_submitted',
}

export interface JourneyAssigneeViewColumn extends ZetkinViewColumnBase {
  type: COLUMN_TYPE.JOURNEY_ASSIGNEE;
  config: {
    journey_id?: number;
  };
}

export interface LocalBoolViewColumn extends ZetkinViewColumnBase {
  type: COLUMN_TYPE.LOCAL_BOOL;
  config?: Record<string, never>;
}

export interface LocalPersonViewColumn extends ZetkinViewColumnBase {
  type: COLUMN_TYPE.LOCAL_PERSON;
  config?: Record<string, never>;
}

export interface LocalSmartSearchViewColumn extends ZetkinViewColumnBase {
  type: COLUMN_TYPE.LOCAL_SMART_SEARCH;
  config: {
    filter_spec: ZetkinSmartSearchFilter<AnyFilterConfig>[];
  };
}

export interface LocalTextViewColumn extends ZetkinViewColumnBase {
  type: COLUMN_TYPE.LOCAL_TEXT;
  config?: Record<string, never>;
}

export interface PersonNotesViewColumn extends ZetkinViewColumnBase {
  type: COLUMN_TYPE.PERSON_NOTES;
  config?: Record<string, never>;
}

export interface PersonFieldViewColumn extends ZetkinViewColumnBase {
  type: COLUMN_TYPE.PERSON_FIELD;
  config: {
    field: string;
  };
}

export interface PersonQueryViewColumn extends ZetkinViewColumnBase {
  type: COLUMN_TYPE.PERSON_QUERY;
  config: {
    query_id: number;
  };
}

export interface PersonTagViewColumn extends ZetkinViewColumnBase {
  type: COLUMN_TYPE.PERSON_TAG;
  config: {
    tag_id: number;
  };
}

export interface SurveyOptionViewColumn extends ZetkinViewColumnBase {
  type: COLUMN_TYPE.SURVEY_OPTION;
  config: {
    option_id: number;
    question_id: number;
  };
}

export interface SurveyOptionsViewColumn extends ZetkinViewColumnBase {
  type: COLUMN_TYPE.SURVEY_OPTIONS;
  config: {
    question_id: number;
  };
}

export interface SurveyResponseViewColumn extends ZetkinViewColumnBase {
  type: COLUMN_TYPE.SURVEY_RESPONSE;
  config: {
    question_id: number;
  };
}

export interface SurveySubmittedViewColumn extends ZetkinViewColumnBase {
  type: COLUMN_TYPE.SURVEY_SUBMITTED;
  config: {
    survey_id: number;
  };
}

export type ZetkinViewColumn =
  | JourneyAssigneeViewColumn
  | LocalBoolViewColumn
  | LocalPersonViewColumn
  | LocalSmartSearchViewColumn
  | LocalTextViewColumn
  | PersonNotesViewColumn
  | PersonFieldViewColumn
  | PersonQueryViewColumn
  | PersonTagViewColumn
  | SurveyOptionViewColumn
  | SurveyOptionsViewColumn
  | SurveyResponseViewColumn
  | SurveySubmittedViewColumn;

export type NewZetkinViewColumn = Record<string, never>;

export type PendingZetkinViewColumn = Omit<ZetkinViewColumn, 'id'>;

export type SelectedViewColumn =
  | NewZetkinViewColumn // When creating a new column
  | PendingZetkinViewColumn // When adding values to a new column
  | ZetkinViewColumn; // When selecting an existing column

export enum NATIVE_PERSON_FIELDS {
  ALT_PHONE = 'alt_phone',
  CO_ADDRESS = 'co_address',
  COUNTRY = 'country',
  CITY = 'city',
  EMAIL = 'email',
  EXT_ID = 'ext_id',
  FIRST_NAME = 'first_name',
  GENDER = 'gender',
  LAST_NAME = 'last_name',
  PHONE = 'phone',
  STREET_ADDRESS = 'street_address',
  ZIP_CODE = 'zip_code',
}
