import {
  ZetkinJourney,
  ZetkinJourneyInstance,
  ZetkinJourneyMilestone,
  ZetkinJourneyMilestoneStatus,
  ZetkinNote,
  ZetkinPerson,
  ZetkinTag,
} from '../../utils/types/zetkin';

export enum UPDATE_TYPES {
  ANY_ADDTAGS = '*.addtags',
  ANY_REMOVETAGS = '*.removetags',
  JOURNEYINSTANCE_ADDASSIGNEE = 'journeyinstance.addassignee',
  JOURNEYINSTANCE_ADDSUBJECT = 'journeyinstance.addsubject',
  JOURNEYINSTANCE_ADDNOTE = 'journeyinstance.addnote',
  JOURNEYINSTANCE_CLOSE = 'journeyinstance.close',
  JOURNEYINSTANCE_CONVERT = 'journeyinstance.convert',
  JOURNEYINSTANCE_CREATE = 'journeyinstance.create',
  JOURNEYINSTANCE_OPEN = 'journeyinstance.open',
  JOURNEYINSTANCE_REMOVEASSIGNEE = 'journeyinstance.removeassignee',
  JOURNEYINSTANCE_REMOVESUBJECT = 'journeyinstance.removesubject',
  JOURNEYINSTANCE_UPDATE = 'journeyinstance.update',
  JOURNEYINSTANCE_UPDATEMILESTONE = 'journeyinstance.updatemilestone',
}

interface ZetkinUpdateBase<UpdateType, Target, Details = null> {
  actor: Pick<ZetkinPerson, 'id' | 'first_name' | 'last_name'>;
  details: Details;
  id: string;
  organization: { id: number; title: string };
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

export type ZetkinUpdateJourneyInstanceSubject = ZetkinUpdateBase<
  | UPDATE_TYPES.JOURNEYINSTANCE_ADDSUBJECT
  | UPDATE_TYPES.JOURNEYINSTANCE_REMOVESUBJECT,
  ZetkinJourneyInstance,
  {
    subject: Pick<ZetkinPerson, 'id' | 'first_name' | 'last_name'>;
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

export type ZetkinUpdateJourneyInstanceConvert = ZetkinUpdateBase<
  UPDATE_TYPES.JOURNEYINSTANCE_CONVERT,
  ZetkinJourneyInstance,
  {
    new_journey: ZetkinJourney;
    old_journey: ZetkinJourney;
  }
>;

export type ZetkinUpdateJourneyInstanceOpen = ZetkinUpdateBase<
  UPDATE_TYPES.JOURNEYINSTANCE_OPEN,
  ZetkinJourneyInstance,
  null
>;

export type ZetkinUpdateTags = ZetkinUpdateBase<
  UPDATE_TYPES.ANY_ADDTAGS | UPDATE_TYPES.ANY_REMOVETAGS,
  unknown,
  {
    tags: ZetkinTag[];
  }
>;

export type ZetkinUpdateJourneyInstanceAddNote = ZetkinUpdateBase<
  UPDATE_TYPES.JOURNEYINSTANCE_ADDNOTE,
  ZetkinJourneyInstance,
  {
    note: ZetkinNote;
  }
>;

export type ZetkinUpdate =
  | ZetkinUpdateTags
  | ZetkinUpdateJourneyInstance
  | ZetkinUpdateJourneyInstanceAddNote
  | ZetkinUpdateJourneyInstanceAssignee
  | ZetkinUpdateJourneyInstanceClose
  | ZetkinUpdateJourneyInstanceConvert
  | ZetkinUpdateJourneyInstanceMilestone
  | ZetkinUpdateJourneyInstanceOpen
  | ZetkinUpdateJourneyInstanceStart
  | ZetkinUpdateJourneyInstanceSubject;
