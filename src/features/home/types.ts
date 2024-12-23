import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import { ZetkinCallAssignment, ZetkinEvent } from 'utils/types/zetkin';

type MyEventActivity = {
  data: ZetkinEventWithStatus;
  kind: 'event';
  start: Date;
};

type MyCallAssignmentActivity = {
  data: ZetkinCallAssignment;
  kind: 'call';
  start: Date;
};

type MyAreaAssignmentActivity = {
  data: ZetkinAreaAssignment;
  kind: 'canvass';
  start: Date;
};

export type MyActivity =
  | MyEventActivity
  | MyCallAssignmentActivity
  | MyAreaAssignmentActivity;

export type ZetkinEventWithStatus = ZetkinEvent & {
  status: 'signedUp' | 'booked' | null;
};
