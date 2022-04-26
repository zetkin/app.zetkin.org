import {
  ZetkinJourneyInstance,
  ZetkinJourneyMilestone,
  ZetkinJourneyMilestoneStatus,
  ZetkinPerson,
} from './zetkin';

export enum UPDATE_TYPES {
  JOURNEYINSTANCE_ADDASSIGNEE = 'journeyinstance.addassignee',
  JOURNEYINSTANCE_UPDATEMILESTONE = 'journeyinstance.updatemilestone',
}

export interface ZetkinUpdate {
  actor: Pick<ZetkinPerson, 'id' | 'first_name' | 'last_name'>;
  timestamp: string;
  type: `${UPDATE_TYPES}`;
}

type ZetkinUpdateChange<UpdateType> = {
  [Property in keyof UpdateType]: {
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
    changes: ZetkinUpdateChange<ZetkinJourneyMilestoneStatus>;
    milestone: ZetkinJourneyMilestone;
  };
  target: ZetkinJourneyInstance;
}
