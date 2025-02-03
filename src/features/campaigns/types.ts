import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import {
  ZetkinCallAssignment,
  ZetkinEmail,
  ZetkinEvent,
  ZetkinSurvey,
  ZetkinTask,
} from 'utils/types/zetkin';

export enum ACTIVITIES {
  CALL_ASSIGNMENT = 'callAssignment',
  AREA_ASSIGNMENT = 'areaAssignment',
  EMAIL = 'email',
  EVENT = 'event',
  SURVEY = 'survey',
  TASK = 'task',
}

type CampaignActivityBase = {
  visibleFrom: Date | null;
  visibleUntil: Date | null;
};

export type CallAssignmentActivity = CampaignActivityBase & {
  data: ZetkinCallAssignment;
  kind: ACTIVITIES.CALL_ASSIGNMENT;
};

export type AreaAssignmentActivity = CampaignActivityBase & {
  data: ZetkinAreaAssignment;
  kind: ACTIVITIES.AREA_ASSIGNMENT;
};

export type SurveyActivity = CampaignActivityBase & {
  data: ZetkinSurvey;
  kind: ACTIVITIES.SURVEY;
};

export type TaskActivity = CampaignActivityBase & {
  data: ZetkinTask;
  kind: ACTIVITIES.TASK;
};

export type EventActivity = CampaignActivityBase & {
  data: ZetkinEvent;
  kind: ACTIVITIES.EVENT;
};

export type EmailActivity = CampaignActivityBase & {
  data: ZetkinEmail;
  kind: ACTIVITIES.EMAIL;
};

export type CampaignActivity =
  | CallAssignmentActivity
  | AreaAssignmentActivity
  | EmailActivity
  | EventActivity
  | SurveyActivity
  | TaskActivity;

export type ActivityOverview = {
  alsoThisWeek: CampaignActivity[];
  today: CampaignActivity[];
  tomorrow: CampaignActivity[];
};
