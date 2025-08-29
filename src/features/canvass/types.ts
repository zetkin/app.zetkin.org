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

//TODO: use from theme object, when canvass is moved to ZUI
export const householdColors = [
  '#F1A8A8',
  '#F7BC9E',
  '#FDDF91',
  '#DFEF95',
  '#BBF1AD',
  '#99E9CC',
  '#93E9EB',
  '#B3DAEE',
  '#CAC7F7',
  '#E5C0F5',
  '#F1A9C9',
  '#DC2626',
  '#EA580C',
  '#FBBF24',
  '#C0DE2B',
  '#77E25B',
  '#34D399',
  '#28D4D7',
  '#0284C7',
  '#4F46E5',
  '#AA2DDF',
  '#DB2777',
  '#841717',
  '#8C3507',
  '#977316',
  '#73851A',
  '#478837',
  '#1F7F5C',
  '#187F81',
  '#014F77',
  '#2F2A89',
  '#661B86',
  '#831747',
  '#6D6D6D',
  '#000000',
] as const;
export type HouseholdColor = typeof householdColors[number] | 'clear';

export type HouseholdWithColor = {
  color: HouseholdColor;
  id: number;
  level: number;
  location_id: number;
  title: string;
};

export type Zetkin2Household = Omit<HouseholdWithColor, 'color'>;

export type HouseholdPatchBody = Partial<Omit<HouseholdWithColor, 'id'>>;
