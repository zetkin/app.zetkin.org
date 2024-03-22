import { TASK_TYPE } from 'features/tasks/components/types';

export enum FILTER_TYPE {
  ALL = 'all',
  CALL_BLOCKED = 'call_blocked',
  CALL_HISTORY = 'call_history',
  CAMPAIGN_PARTICIPATION = 'campaign_participation',
  EMAIL_BLACKLIST = 'email_blacklist',
  EMAIL_CLICK = 'email_click',
  EMAIL_HISTORY = 'email_history',
  MOST_ACTIVE = 'most_active',
  PERSON_DATA = 'person_data',
  PERSON_FIELD = 'person_field',
  PERSON_TAGS = 'person_tags',
  PERSON_VIEW = 'person_view',
  RANDOM = 'random',
  SUB_QUERY = 'sub_query',
  SURVEY_OPTION = 'survey_option',
  SURVEY_RESPONSE = 'survey_response',
  SURVEY_SUBMISSION = 'survey_submission',
  TASK = 'task',
  USER = 'user',
}

export enum CONDITION_OPERATOR {
  ALL = 'all',
  ANY = 'any',
  NONE = 'none',
}

export enum IN_OPERATOR {
  IN = 'in',
  NOTIN = 'notin',
}

export enum MATCH_OPERATORS {
  IN = 'in',
  NOT_IN = 'notin',
  EQUALS = 'eq',
  NOT_EQUALS = 'noteq',
}

export enum CALL_OPERATOR {
  CALLED = 'called',
  REACHED = 'reached',
  NOTREACHED = 'notreached',
}

export enum OPERATION {
  ADD = 'add',
  SUB = 'sub',
  LIMIT = 'limit',
}

export enum QUANTITY {
  INT = 'integer',
  PERCENT = 'percent',
}

export enum TIME_FRAME {
  EVER = 'ever',
  FUTURE = 'future',
  BEFORE_TODAY = 'beforeToday',
  BEFORE_DATE = 'beforeDate',
  AFTER_DATE = 'afterDate',
  BETWEEN = 'between',
  LAST_FEW_DAYS = 'lastFew',
}

export enum MATCHING {
  MIN = 'min',
  MAX = 'max',
  BETWEEN = 'between',
  ONCE = 'once',
}

export enum DATA_FIELD {
  FIRST_NAME = 'first_name',
  LAST_NAME = 'last_name',
  EMAIL = 'email',
  GENDER = 'gender',
  CITY = 'city',
  STREET_ADDRESS = 'street_address',
  CO_ADDRESS = 'co_address',
  ZIP_CODE = 'zip_code',
  PHONE = 'phone',
  ALT_PHONE = 'alt_phone',
}

export enum TASK_STATUS {
  COMPLETED = 'completed',
  IGNORED = 'ignored',
  ASSIGNED = 'assigned',
}

/**
 * Filter Configs
 */
export type DefaultFilterConfig = Record<string, never>; // Default filter config is an empty object

export interface CallBlockedFilterConfig {
  reason:
    | 'allocated'
    | 'organizer_action_needed'
    | 'call_back_after'
    | 'cooldown'
    | 'no_number'
    | 'any';
}

export interface CallHistoryFilterConfig {
  operator: CALL_OPERATOR;
  assignment?: number;
  minTimes?: number;
  before?: string;
  after?: string;
}
export interface EmailBlacklistFilterConfig {
  reason: 'unsub_org' | 'any';
}
export interface EmailClickFilterConfig {
  after?: string;
  before?: string;
  campaign?: number;
  email?: number;
  operator: 'clicked' | 'not_clicked';
  link?: number[];
}
export interface EmailHistoryFilterConfig {
  after?: string;
  before?: string;
  campaign?: number;
  email?: number;
  operator: 'sent' | 'not_sent' | 'opened' | 'not_opened';
}
export interface MostActiveFilterConfig {
  after?: string;
  before?: string;
  size: number;
}

export interface PersonDataFilterConfig {
  fields: {
    alt_phone?: string;
    city?: string;
    co_address?: string;
    email?: string;
    first_name?: string;
    gender?: string;
    last_name?: string;
    phone?: string;
    street_address?: string;
    zip_code?: string;
  };
}

export interface PersonFieldFilterConfig {
  after?: string;
  before?: string;
  field: string;
  search?: string;
}

export interface PersonTagsFilterConfig {
  condition: CONDITION_OPERATOR;
  tags: number[];
  min_matching?: number;
}

export interface PersonViewFilterConfig {
  view: number;
  operator: IN_OPERATOR;
}

export interface RandomFilterConfig {
  size: number;
  seed: string;
}

export interface SurveyOptionFilterConfig {
  survey: number;
  question: number;
  options: number[];
  operator: CONDITION_OPERATOR;
}

export interface SurveyResponseBase {
  operator: MATCH_OPERATORS;
  value: string;
}

type SurveyResponseWithQuestion = SurveyResponseBase & { question: number };
type SurveyResponseWithSurvey = SurveyResponseBase & { survey: number };

export type SurveyResponseFilterConfig =
  | SurveyResponseWithQuestion
  | SurveyResponseWithSurvey;

export interface SurveySubmissionFilterConfig {
  after?: string;
  before?: string;
  operator: 'submitted';
  survey: number;
}

export interface UserFilterConfig {
  is_user: boolean;
}

export interface CampaignParticipationConfig {
  state: 'booked' | 'signed_up';
  operator: 'in' | 'notin';
  campaign?: number;
  activity?: number;
  location?: number;
  after?: string;
  before?: string;
}

export interface SubQueryFilterConfig {
  query_id: number;
  operator?: IN_OPERATOR;
}

interface TaskTimeFrameBefore {
  before: string;
}

interface TaskTimeFrameAfter {
  after: string;
}

interface TaskTimeFrameBetween {
  after: string;
  before: string;
}

export type TaskTimeFrame =
  | boolean
  | TaskTimeFrameAfter
  | TaskTimeFrameBefore
  | TaskTimeFrameBetween;

export interface TaskFilterConfig {
  campaign?: number;
  task?: number;
  type?: TASK_TYPE;
  assigned?: TaskTimeFrame;
  completed?: TaskTimeFrame;
  ignored?: TaskTimeFrame;
  time_estimate?: {
    max?: number;
    min?: number;
  };
  matching?: {
    max?: number;
    min?: number;
  };
}

export type AnyFilterConfig =
  | CallBlockedFilterConfig
  | CallHistoryFilterConfig
  | CampaignParticipationConfig
  | DefaultFilterConfig
  | EmailBlacklistFilterConfig
  | MostActiveFilterConfig
  | PersonDataFilterConfig
  | PersonFieldFilterConfig
  | PersonTagsFilterConfig
  | PersonViewFilterConfig
  | RandomFilterConfig
  | SubQueryFilterConfig
  | SurveyOptionFilterConfig
  | SurveyResponseFilterConfig
  | SurveySubmissionFilterConfig
  | TaskFilterConfig
  | UserFilterConfig; // Add all filter objects here

/** Filters */
export interface ZetkinSmartSearchFilter<C = AnyFilterConfig> {
  config: C;
  op?: OPERATION;
  type: FILTER_TYPE;
}

export interface SmartSearchFilterWithId<C = AnyFilterConfig>
  extends ZetkinSmartSearchFilter<C> {
  id: number;
}

export interface NewSmartSearchFilter {
  type: FILTER_TYPE;
}

// Used for `selectedFilter` handling
export type SelectedSmartSearchFilter<C = AnyFilterConfig> =
  | SmartSearchFilterWithId<C> // When existing filter is being edited
  | NewSmartSearchFilter // When a new filter is being created
  | null; // When no filter selected

export enum QUERY_TYPE {
  STANDALONE = 'standalone',
  PURPOSE = 'callassignment_goal',
  TARGET = 'callassignment_target',
}

export interface ZetkinQuery {
  id: number;
  type?: QUERY_TYPE;
  filter_spec: ZetkinSmartSearchFilter[];
  title?: string;
  info_text?: string;
}

export enum QUERY_STATUS {
  NEW = 'new', // no smart search query created yet
  EDITABLE = 'editable', // draft or scheduled task
  PUBLISHED = 'published', // published but not yet assigned
  ASSIGNED = 'assigned', // published and assigned
}
