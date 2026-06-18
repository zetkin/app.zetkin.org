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

export type EmailChannel = {
  id: number;
  is_blocked: boolean;
  organization_id: number;
  published: string | null;
  published_by_user_id: number | null;
  sender_email: string;
  sender_name: string;
  title: string;
};
