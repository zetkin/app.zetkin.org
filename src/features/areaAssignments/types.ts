export type AreaAssigneeInfo = {
  id: number;
  sessions: ZetkinAreaAssignee[];
};

export type ZetkinMetric = {
  area_assignment_id: number;
  defines_success: boolean;
  description?: string;
  id: number;
  question: string;
  type: 'bool' | 'scale5';
};

export type ZetkinMetricPatchBody = Partial<Omit<ZetkinMetric, 'id'>>;
export type ZetkinMetricPostBody = Partial<Omit<ZetkinMetric, 'id'>>;

export type ZetkinAreaAssignment = {
  end_date: string | null;
  id: number;
  instructions: string;
  organization_id: number;
  project_id: number;
  reporting_level: 'household' | 'location';
  start_date: string | null;
  title: string;
};

export type ZetkinAreaAssignmentPostBody = Partial<
  Omit<ZetkinAreaAssignment, 'id' | 'campaign' | 'organization'>
>;

export type ZetkinAreaAssignmentPatchbody = Partial<
  Omit<ZetkinAreaAssignment, 'id'>
>;

export type Visit = {
  assignment_id: number;
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
  id: number;
  latitude: number;
  longitude: number;
  num_estimated_households: number;
  num_households_successful: number;
  num_households_visited: number;
  num_known_households: number;
  organization_id: number;
  title: string;
};

export type ZetkinAreaAssignee = {
  area_id: number;
  assignment_id: number;
  user_id: number;
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
  area_id: number | null;
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
  area_id: number | null;
  data: AreaGraphData[];
};

export type AreaGraphData = {
  date: string;
  hour: string;
  householdVisits: number;
  successfulVisits: number;
};

export type SessionDeletedPayload = {
  areaId: number;
  assigneeId: number;
  assignmentId: number;
};
