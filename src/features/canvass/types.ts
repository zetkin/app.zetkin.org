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
export const householdHexColors = [
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
export type HouseholdHexColor = typeof householdHexColors[number];

export const householdColorNames = [
  'lightRed',
  'lightOrange',
  'lightYellow',
  'lightLime',
  'lightGreen',
  'lightTurquoise',
  'lightAqua',
  'lightBlue',
  'lightIndigo',
  'lightPurple',
  'lightPink',
  'mediumRed',
  'mediumOrange',
  'mediumYellow',
  'mediumLime',
  'mediumGreen',
  'mediumTurqouise',
  'mediumAqua',
  'mediumBlue',
  'mediumIndigo',
  'mediumPurple',
  'mediumPink',
  'darkRed',
  'darkOrange',
  'darkYellow',
  'darkLime',
  'darkGreen',
  'darkTurqouise',
  'darkAqua',
  'darkBlue',
  'darkIndigo',
  'darkPurple',
  'darkPink',
  'grey',
  'black',
] as const;
export type HouseholdColorName = typeof householdColorNames[number];
export type HouseholdColor = HouseholdHexColor | 'clear';

export const hexColorToHouseholdColor: Record<
  HouseholdHexColor,
  HouseholdColorName
> = {
  '#000000': 'black',
  '#014F77': 'darkBlue',
  '#0284C7': 'mediumBlue',
  '#187F81': 'darkAqua',
  '#1F7F5C': 'darkTurqouise',
  '#28D4D7': 'mediumAqua',
  '#2F2A89': 'darkIndigo',
  '#34D399': 'mediumTurqouise',
  '#478837': 'darkGreen',
  '#4F46E5': 'mediumIndigo',
  '#661B86': 'darkPurple',
  '#6D6D6D': 'grey',
  '#73851A': 'darkLime',
  '#77E25B': 'mediumGreen',
  '#831747': 'darkPink',
  '#841717': 'darkRed',
  '#8C3507': 'darkOrange',
  '#93E9EB': 'lightAqua',
  '#977316': 'darkYellow',
  '#99E9CC': 'lightTurquoise',
  '#AA2DDF': 'mediumPurple',
  '#B3DAEE': 'lightBlue',
  '#BBF1AD': 'lightGreen',
  '#C0DE2B': 'mediumLime',
  '#CAC7F7': 'lightIndigo',
  '#DB2777': 'mediumPink',
  '#DC2626': 'mediumRed',
  '#DFEF95': 'lightLime',
  '#E5C0F5': 'lightPurple',
  '#EA580C': 'mediumOrange',
  '#F1A8A8': 'lightRed',
  '#F1A9C9': 'lightPink',
  '#F7BC9E': 'lightOrange',
  '#FBBF24': 'mediumYellow',
  '#FDDF91': 'lightYellow',
};

export type HouseholdWithColor = {
  color: HouseholdColor;
  id: number;
  level: number;
  location_id: number;
  title: string;
};

export type Zetkin2Household = Omit<HouseholdWithColor, 'color'>;

export type HouseholdPatchBody = Partial<Omit<HouseholdWithColor, 'id'>>;
