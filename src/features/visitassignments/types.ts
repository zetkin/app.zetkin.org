import { MetricBulkResponse } from '../canvass/types';
import { ZetkinQuery } from 'features/smartSearch/components/types';
import { ZetkinAppliedTag } from 'utils/types/zetkin';

export type ZetkinVisitAssignee = {
  excluded_tags: ZetkinAppliedTag[];
  first_name: string;
  id: number;
  last_name: string;
  prioritized_tags: ZetkinAppliedTag[];
  user_id: number;
  visitAssId: number;
};

export type VisitAssigneeInfo = {
  id: number;
  sessions: ZetkinVisitAssignee[];
};

export type ZetkinVisitAssignment = {
  assignees: ZetkinVisitAssignee[];
  campaign: {
    id: number;
    title: string;
  };
  end_date: string | null;
  id: number;
  organization: {
    id: number;
  };
  queryId: number;
  start_date: string | null;
  target: ZetkinQuery;
  title: string | null;
};

export type ZetkinVisitAssignmentPostBody = Partial<
  Omit<ZetkinVisitAssignment, 'id' | 'campaign' | 'organization'>
> & {
  campaign_id: number | null;
};

export type ZetkinVisitAssignmentPatchbody = Partial<
  Omit<ZetkinVisitAssignment, 'id'>
>;

export type VisitCardData = {
  data: VisitGraphData[];
  visit_id: number | null;
};

export type VisitGraphData = {
  date: string;
  hour: string;
  numberOfVisits: number;
  successfulVisits: number;
};

export type ZetkinVisitAssignmentStats = {
  allTargets: number;
  metrics: MetricBulkResponse;
  num_households: number;
  num_households_successfully_visited: number | null;
  num_households_visited: number | null;
  num_locations: number;
  num_locations_visited: number;
  num_successful_visits: number;
  num_visits: number;
};

export type ZetkinVisitStatsItem = {
  num_households: number;
  num_locations: number;
  num_successful_visits: number;
  num_visited_households: number;
  num_visited_locations: number;
  visit_id: number | null;
};

export type ZetkinAssignmentHouseholdStats = {
  stats: ZetkinVisitStatsItem[];
};

export type SessionDeletedPayload = {
  assigneeId: number;
  assignmentId: number;
  visitId: number;
};

export type ZetkinMetric = {
  created: string;
  defines_success: boolean;
  description?: string;
  id: number;
  question: string;
  type: 'bool' | 'scale5';
  visit_assignment_id: number;
};

export type ZetkinMetricPatchBody = Partial<Omit<ZetkinMetric, 'id'>>;
export type ZetkinMetricPostBody = Partial<Omit<ZetkinMetric, 'id'>>;
