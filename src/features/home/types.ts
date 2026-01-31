import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import { ZetkinCallAssignment, ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinVisitAssignment } from 'features/visitassignments/types';

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

type MyVisitAssignmentActivity = {
  data: ZetkinVisitAssignment;
  kind: 'visit';
  start: Date;
};

export type MyActivity =
  | MyEventActivity
  | MyCallAssignmentActivity
  | MyAreaAssignmentActivity
  | MyVisitAssignmentActivity;

export type ZetkinEventWithStatus = ZetkinEvent &
  (
    | {
        status: 'signedUp' | null;
      }
    | {
        contact?: null | {
          email?: string;
          id: number;
          name: string;
          phone?: string;
        };
        status: 'booked';
      }
  );
