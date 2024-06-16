export enum ParticipantOpKind {
  ADD = 'add',
  REMOVE = 'remove',
}

export type ParticipantOp = {
  eventId: number;
  kind: ParticipantOpKind;
  personId: number;
};
