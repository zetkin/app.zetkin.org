import { ZetkinJourneyInstance, ZetkinPerson } from './zetkin';

export enum UPDATE_TYPES {
  JOURNEYINSTANCE_ADDASSIGNEE = 'journeyinstance.addassignee',
  JOURNEYINSTANCE_UPDATEMILESTONE = 'journeyinstance.updatemilestone',
}

export interface ZetkinUpdate {
  actor?: Pick<ZetkinPerson, 'id' | 'first_name' | 'last_name'>;
  created_at: string;
  type: `${UPDATE_TYPES}`;
}

export interface ZetkinUpdateAssignee extends ZetkinUpdate {
  details: {
    assignee: Pick<ZetkinPerson, 'id' | 'first_name' | 'last_name'>;
  };
  target: ZetkinJourneyInstance;
}
