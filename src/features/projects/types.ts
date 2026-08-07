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

type ProjectActivityBase = {
  visibleFrom: Date | null;
  visibleUntil: Date | null;
};

export type CallAssignmentActivity = ProjectActivityBase & {
  data: ZetkinCallAssignment;
  kind: ACTIVITIES.CALL_ASSIGNMENT;
};

export type AreaAssignmentActivity = ProjectActivityBase & {
  data: ZetkinAreaAssignment;
  kind: ACTIVITIES.AREA_ASSIGNMENT;
};

export type SurveyActivity = ProjectActivityBase & {
  data: ZetkinSurvey;
  kind: ACTIVITIES.SURVEY;
};

export type TaskActivity = ProjectActivityBase & {
  data: ZetkinTask;
  kind: ACTIVITIES.TASK;
};

export type EventActivity = ProjectActivityBase & {
  data: ZetkinEvent;
  kind: ACTIVITIES.EVENT;
};

export type EmailActivity = ProjectActivityBase & {
  data: ZetkinEmail;
  kind: ACTIVITIES.EMAIL;
};

export type ProjectActivity =
  | CallAssignmentActivity
  | AreaAssignmentActivity
  | EmailActivity
  | EventActivity
  | SurveyActivity
  | TaskActivity;

export type ActivityOverview = {
  alsoThisWeek: ProjectActivity[];
  today: ProjectActivity[];
  tomorrow: ProjectActivity[];
};
