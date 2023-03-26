import {
  ZetkinCallAssignment,
  ZetkinCampaign,
  ZetkinPerson,
  ZetkinSurvey,
  ZetkinTask,
  ZetkinView,
} from 'utils/types/zetkin';

export enum SEARCH_DATA_TYPE {
  PERSON = 'person',
  CAMPAIGN = 'campaign',
  TASK = 'task',
  VIEW = 'view',
  CALL_ASSIGNMENT = 'callassignment',
  SURVEY = 'survey',
}

export interface PersonSearchResult {
  type: SEARCH_DATA_TYPE.PERSON;
  match: ZetkinPerson;
}
export interface CampaignSearchResult {
  type: SEARCH_DATA_TYPE.CAMPAIGN;
  match: ZetkinCampaign;
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

export type SearchResult =
  | PersonSearchResult
  | CampaignSearchResult
  | TaskSearchResult
  | ViewSearchResult
  | CallAssignmentSearchResult
  | SurveySearchResult;
