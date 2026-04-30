import {
  ZetkinCallAssignment,
  ZetkinProject,
  ZetkinJourneyInstance,
  ZetkinPerson,
  ZetkinSurvey,
  ZetkinTask,
  ZetkinView,
} from 'utils/types/zetkin';

export enum SEARCH_DATA_TYPE {
  PERSON = 'person',
  PROJECT = 'campaign',
  TASK = 'task',
  VIEW = 'view',
  CALL_ASSIGNMENT = 'callassignment',
  SURVEY = 'survey',
  JOURNEY_INSTANCE = 'journeyinstance',
}

export interface PersonSearchResult {
  type: SEARCH_DATA_TYPE.PERSON;
  match: ZetkinPerson;
}
export interface ProjectSearchResult {
  type: SEARCH_DATA_TYPE.PROJECT;
  match: ZetkinProject;
}
export interface TaskSearchResult {
  type: SEARCH_DATA_TYPE.TASK;
  match: ZetkinTask;
}
export interface ViewSearchResult {
  type: SEARCH_DATA_TYPE.VIEW;
  match: ZetkinView;
}
export interface CallAssignmentSearchResult {
  type: SEARCH_DATA_TYPE.CALL_ASSIGNMENT;
  match: ZetkinCallAssignment;
}
export interface SurveySearchResult {
  type: SEARCH_DATA_TYPE.SURVEY;
  match: ZetkinSurvey;
}
export interface JourneyInstanceSearchResult {
  type: SEARCH_DATA_TYPE.JOURNEY_INSTANCE;
  match: ZetkinJourneyInstance;
}

export type SearchResult =
  | PersonSearchResult
  | ProjectSearchResult
  | TaskSearchResult
  | ViewSearchResult
  | CallAssignmentSearchResult
  | SurveySearchResult
  | JourneyInstanceSearchResult;
