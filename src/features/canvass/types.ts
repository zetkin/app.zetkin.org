import { ZetkinLocation } from 'features/areaAssignments/types';

export type YesNoMetricBulkResponse = {
  metric_id: number;
  num_no: number;
  num_yes: number;
};

export type Scale5MetricBulkResponse = {
  metric_id: number;
  num_values: [number, number, number, number, number];
};

export type MetricBulkResponse =
  | YesNoMetricBulkResponse
  | Scale5MetricBulkResponse;

export type ZetkinLocationVisit = {
  assignment_id: number;
  created: string;
  created_by_user_id: number;
  id: number;
  location_id: number;
  metrics: MetricBulkResponse[];
  num_households_visited: number;
};

export type ZetkinLocationVisitPostBody = Omit<
  ZetkinLocationVisit,
  'id' | 'created' | 'created_by_user_id' | 'location_id' | 'assignment_id'
>;

export type ZetkinHouseholdVisit = {
  assignment_id: number;
  created: string;
  created_by_user_id: number;
  household_id: number;
  id: number;
  metrics: MetricResponse[];
};

export type YesNoMetricResponse = {
  metric_id: number;
  response: 'yes' | 'no';
};

export type Scale5MetricResponse = {
  metric_id: number;
  response: 1 | 2 | 3 | 4 | 5 | string;
};

export type MetricResponse = YesNoMetricResponse | Scale5MetricResponse;

export type ZetkinHouseholdVisitPostBody = Omit<
  ZetkinHouseholdVisit,
  'assignment_id' | 'created' | 'created_by_user_id' | 'household_id' | 'id'
>;

export type ZetkinLocationPostBody = Partial<Omit<ZetkinLocation, 'id'>>;

export type ZetkinLocationPatchBody = Partial<Omit<ZetkinLocation, 'id'>>;

export type Zetkin2Household = {
  colorCode: string | null;
  id: number;
  level: number;
  location_id: number;
  title: string;
};

export type APIHousehold = Omit<Zetkin2Household, 'colorCode'>;

export type HouseholdPatchBody = Partial<Omit<Zetkin2Household, 'id'>>;
