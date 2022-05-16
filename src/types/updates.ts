import {
  ZetkinJourneyInstance,
  ZetkinJourneyMilestone,
  ZetkinJourneyMilestoneStatus,
  ZetkinPerson,
} from './zetkin';

export enum UPDATE_TYPES {
  JOURNEYINSTANCE_ADDASSIGNEE = 'journeyinstance.addassignee',
  JOURNEYINSTANCE_CREATE = 'journeyinstance.create',
  JOURNEYINSTANCE_REMOVEASSIGNEE = 'journeyinstance.removeassignee',
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

export type ZetkinUpdateAssignee = ZetkinUpdateBase<
  | UPDATE_TYPES.JOURNEYINSTANCE_ADDASSIGNEE
  | UPDATE_TYPES.JOURNEYINSTANCE_REMOVEASSIGNEE,
  ZetkinJourneyInstance,
  {
    assignee: Pick<ZetkinPerson, 'id' | 'first_name' | 'last_name'>;
  }
>;

export type ZetkinUpdateJourneyMilestone = ZetkinUpdateBase<
  UPDATE_TYPES.JOURNEYINSTANCE_UPDATEMILESTONE,
  ZetkinJourneyInstance,
  {
    changes: ZetkinUpdateChange<
      Pick<ZetkinJourneyMilestoneStatus, 'completed' | 'deadline'>
    >;
    milestone: ZetkinJourneyMilestone;
  }
>;

export type ZetkinUpdateJourneyStart = ZetkinUpdateBase<
  UPDATE_TYPES.JOURNEYINSTANCE_CREATE,
  ZetkinJourneyInstance,
  {
    data: Pick<
      ZetkinJourneyInstance,
      'id' | 'title' | 'summary' | 'opening_note' | 'closed' | 'journey'
    >;
  }
>;

export type ZetkinUpdate =
  | ZetkinUpdateAssignee
  | ZetkinUpdateJourneyMilestone
  | ZetkinUpdateJourneyStart;

export interface ZetkinUpdateNote extends ZetkinUpdate {
  id: number;
}
