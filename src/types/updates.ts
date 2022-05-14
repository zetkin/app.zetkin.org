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

export type CHANGE_PROPS = {
  [UPDATE_TYPES.JOURNEYINSTANCE_UPDATEMILESTONE]: 'completed' | 'deadline';
};

export interface ZetkinUpdate {
  actor: Pick<ZetkinPerson, 'id' | 'first_name' | 'last_name'>;
  timestamp: string;
  type: `${UPDATE_TYPES}`;
}

type ZetkinUpdateChange<UpdateType> = {
  [Property in keyof UpdateType]?: {
    from: UpdateType[Property];
    to: UpdateType[Property];
  };
};

export interface ZetkinUpdateAssignee extends ZetkinUpdate {
  details: {
    assignee: Pick<ZetkinPerson, 'id' | 'first_name' | 'last_name'>;
  };
  target: ZetkinJourneyInstance;
}

export interface ZetkinUpdateJourneyMilestone extends ZetkinUpdate {
  details: {
    changes: ZetkinUpdateChange<
      Pick<
        ZetkinJourneyMilestoneStatus,
        CHANGE_PROPS[UPDATE_TYPES.JOURNEYINSTANCE_UPDATEMILESTONE]
      >
    >;
    milestone: ZetkinJourneyMilestone;
  };
  target: ZetkinJourneyInstance;
}

export interface ZetkinUpdateJourneyStart extends ZetkinUpdate {
  details: {
    data: Pick<
      ZetkinJourneyInstance,
      'id' | 'title' | 'summary' | 'opening_note' | 'closed' | 'journey'
    >;
  };
  target: ZetkinJourneyInstance;
}
