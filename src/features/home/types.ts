import { ZetkinCanvassAssignment } from 'features/canvassAssignments/types';
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

type MyCanvassAssignmentActivity = {
  data: ZetkinCanvassAssignment;
  kind: 'canvass';
  start: Date;
};

export type MyActivity =
  | MyEventActivity
  | MyCallAssignmentActivity
  | MyCanvassAssignmentActivity;

export type ZetkinEventWithStatus = ZetkinEvent & {
  status: 'signedUp' | 'booked' | null;
};
