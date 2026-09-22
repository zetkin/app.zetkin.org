import { ZetkinPerson } from 'utils/types/zetkin';

export enum ParticipantOpKind {
  ADD = 'add',
  REMOVE = 'remove',
}

export type ParticipantOp = {
  eventId: number;
  kind: ParticipantOpKind;
  personId: number;
};

export type ParticipantWithPoolState = {
  person: ZetkinPerson;
  status: 'added' | 'booked' | 'removed' | 'pending';
};

export type ZetkinEventReminder = {
  action: {
    id: number;
  };
  person: {
    id: number;
    name: string;
  };
  sent: string;
};
