import {
  ZetkinJourneyInstance,
  ZetkinJourneyMilestone,
  ZetkinJourneyMilestoneStatus,
  ZetkinNote,
  ZetkinPerson,
} from './zetkin';

export enum UPDATE_TYPES {
  JOURNEYINSTANCE_ADDASSIGNEE = 'journeyinstance.addassignee',
  JOURNEYINSTANCE_ADDNOTE = 'journeyinstance.addnote',
  JOURNEYINSTANCE_CLOSE = 'journeyinstance.close',
  JOURNEYINSTANCE_CREATE = 'journeyinstance.create',
  JOURNEYINSTANCE_OPEN = 'journeyinstance.open',
  JOURNEYINSTANCE_REMOVEASSIGNEE = 'journeyinstance.removeassignee',
  JOURNEYINSTANCE_UPDATE = 'journeyinstance.update',
  JOURNEYINSTANCE_UPDATEMILESTONE = 'journeyinstance.updatemilestone',
}

interface ZetkinUpdateBase<UpdateType, Target, Details = null> {
  actor: Pick<ZetkinPerson, 'id' | 'first_name' | 'last_name'>;
  details: Details;
  target: Target;
  timestamp: string;
  type: UpdateType;
}

type ZetkinUpdateChange<UpdateType> = {
  [Property in keyof UpdateType]?: {
    from: UpdateType[Property];
    to: UpdateType[Property];
  };
};

export type ZetkinUpdateJourneyInstanceAssignee = ZetkinUpdateBase<
  | UPDATE_TYPES.JOURNEYINSTANCE_ADDASSIGNEE
  | UPDATE_TYPES.JOURNEYINSTANCE_REMOVEASSIGNEE,
  ZetkinJourneyInstance,
  {
    assignee: Pick<ZetkinPerson, 'id' | 'first_name' | 'last_name'>;
  }
>;
export type ZetkinUpdateJourneyInstance = ZetkinUpdateBase<
  UPDATE_TYPES.JOURNEYINSTANCE_UPDATE,
  ZetkinJourneyInstance,
  {
    changes: ZetkinUpdateChange<
      Pick<ZetkinJourneyInstance, 'summary' | 'title'>
    >;
  }
>;

export type ZetkinUpdateJourneyInstanceMilestone = ZetkinUpdateBase<
  UPDATE_TYPES.JOURNEYINSTANCE_UPDATEMILESTONE,
  ZetkinJourneyInstance,
  {
    changes: ZetkinUpdateChange<
      Pick<ZetkinJourneyMilestoneStatus, 'completed' | 'deadline'>
    >;
    milestone: ZetkinJourneyMilestone;
  }
>;

export type ZetkinUpdateJourneyInstanceStart = ZetkinUpdateBase<
  UPDATE_TYPES.JOURNEYINSTANCE_CREATE,
  ZetkinJourneyInstance,
  {
    data: Pick<
      ZetkinJourneyInstance,
      'id' | 'title' | 'summary' | 'opening_note' | 'closed' | 'journey'
    >;
  }
>;

export type ZetkinUpdateJourneyInstanceClose = ZetkinUpdateBase<
  UPDATE_TYPES.JOURNEYINSTANCE_CLOSE,
  ZetkinJourneyInstance,
  {
    outcome: string;
  }
>;

export type ZetkinUpdateJourneyInstanceOpen = ZetkinUpdateBase<
  UPDATE_TYPES.JOURNEYINSTANCE_OPEN,
  ZetkinJourneyInstance,
  null
>;

export type ZetkinUpdateJourneyInstanceAddNote = ZetkinUpdateBase<
  UPDATE_TYPES.JOURNEYINSTANCE_ADDNOTE,
  ZetkinJourneyInstance,
  {
    note: ZetkinNote;
  }
>;

export type ZetkinUpdate =
  | ZetkinUpdateJourneyInstance
  | ZetkinUpdateJourneyInstanceAddNote
  | ZetkinUpdateJourneyInstanceAssignee
  | ZetkinUpdateJourneyInstanceClose
  | ZetkinUpdateJourneyInstanceMilestone
  | ZetkinUpdateJourneyInstanceOpen
  | ZetkinUpdateJourneyInstanceStart;
