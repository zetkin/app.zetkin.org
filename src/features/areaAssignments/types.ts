import { ZetkinArea } from 'features/areas/types';
import { ZetkinPerson } from 'utils/types/zetkin';

export type AreaAssigneeInfo = {
  id: number;
  person: ZetkinPerson;
  sessions: ZetkinAreaAssignmentSession[];
};

export type ZetkinMetric = {
  definesDone: boolean;
  description: string;
  id: string;
  kind: 'boolean' | 'scale5';
  question: string;
};

export type ZetkinAreaAssignment = {
  campaign: {
    id: number;
  };
  end_date: string | null;
  id: string;
  instructions: string;
  metrics: ZetkinMetric[];
  organization: {
    id: number;
  };
  reporting_level: 'household' | 'location';
  start_date: string | null;
  title: string;
};

export type ZetkinAreaAssignmentPostBody = Partial<
  Omit<ZetkinAreaAssignment, 'id' | 'campaign' | 'organization' | 'metrics'>
> & {
  campaign_id: number;
  metrics: Omit<ZetkinMetric, 'id'>[];
};
export type ZetkinAreaAssignmentPatchbody = Partial<
  Omit<ZetkinAreaAssignment, 'id'>
>;

export type Visit = {
  areaAssId: string | null;
  id: string;
  noteToOfficial: string | null;
  personId: number;
  responses: {
    metricId: string;
    response: string;
  }[];
  timestamp: string;
};

export type Household = {
  floor?: number | null;
  id: string;
  title: string;
  visits: Visit[];
};

export type ZetkinLocation = {
  description: string;
  households: Household[];
  id: string;
  orgId: number;
  position: { lat: number; lng: number };
  title: string;
};

export type ZetkinAreaAssignmentSession = {
  area: ZetkinArea;
  assignee: ZetkinPerson;
  assignment: ZetkinAreaAssignment;
};

export type ZetkinAreaAssignmentSessionPostBody = {
  areaId: string;
  personId: number;
};

export type ZetkinAreaAssignmentStats = {
  metrics: {
    metric: ZetkinMetric;
    values: number[];
  }[];
  num_areas: number;
  num_households: number;
  num_locations: number;
  num_successful_visited_households: number;
  num_visited_areas: number;
  num_visited_households: number;
  num_visited_households_outside_areas: number;
  num_visited_locations: number;
  num_visited_locations_outside_areas: number;
};

export type ZetkinAssignmentAreaStatsItem = {
  areaId: string;
  num_households: number;
  num_locations: number;
  num_successful_visited_households: number;
  num_visited_households: number;
  num_visited_locations: number;
};

export type ZetkinAssignmentAreaStats = {
  stats: ZetkinAssignmentAreaStatsItem[];
};

export type AreaCardData = {
  area: {
    id: string;
    title: string | null;
  };
  data: AreaGraphData[];
};

export type AreaGraphData = {
  date: string;
  hour: string;
  householdVisits: number;
  successfulVisits: number;
};

export type SessionDeletedPayload = {
  areaId: string;
  assigneeId: number;
  assignmentId: string;
};
