import { MetricBulkResponse } from '../canvass/types';

export type HouseholdAssigneeInfo = {
  id: number;
  sessions: ZetkinHouseholdAssignee[];
};

export type ZetkinHouseholdAssignment = {
  assignees: number[];
  campId: number;
  end_date: string | null;
  id: string;
  orgId: number;
  start_date: string | null;
  target: string;
  title: string | null;
};

export type ZetkinHouseholdAssignmentPostBody = Partial<
  Omit<ZetkinHouseholdAssignment, 'id' | 'campaign' | 'organization'>
>;

export type ZetkinHouseholdAssignmentPatchbody = Partial<
  Omit<ZetkinHouseholdAssignment, 'id'>
>;

export type ZetkinHouseholdAssignee = {
  assignment_id: number;
  household_id: number;
  user_id: number;
};

export type HouseholdCardData = {
  data: HouseholdGraphData[];
  household_id: number | null;
};

export type HouseholdGraphData = {
  date: string;
  hour: string;
  householdVisits: number;
  successfulVisits: number;
};

export type ZetkinHouseholdAssignmentStats = {
  metrics: MetricBulkResponse;
  num_households: number;
  num_households_successfully_visited: number | null;
  num_households_visited: number | null;
  num_locations: number;
  num_locations_visited: number;
  num_successful_visits: number;
  num_visits: number;
};

export type ZetkinAssignmentHouseholdStatsItem = {
  household_id: number | null;
  num_households: number;
  num_locations: number;
  num_successful_visited_households: number;
  num_visited_households: number;
  num_visited_locations: number;
};

export type ZetkinAssignmentHouseholdStats = {
  stats: ZetkinAssignmentHouseholdStatsItem[];
};

export type SessionDeletedPayload = {
  assigneeId: number;
  assignmentId: number;
  householdId: number;
};

export type ZetkinMetric = {
  created: string;
  defines_success: boolean;
  description?: string;
  household_assignment_id: number;
  id: number;
  question: string;
  type: 'bool' | 'scale5';
};

export type ZetkinMetricPatchBody = Partial<Omit<ZetkinMetric, 'id'>>;
export type ZetkinMetricPostBody = Partial<Omit<ZetkinMetric, 'id'>>;
