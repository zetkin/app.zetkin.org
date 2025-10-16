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
export const householdColorsHex = [
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
export type HouseholdColorHex = typeof householdColorsHex[number];

export const householdColors = [
  'black',
  'darkBlue',
  'mediumBlue',
  'darkAqua',
  'darkTurqouise',
  'mediumAqua',
  'darkIndigo',
  'mediumTurqouise',
  'darkGreen',
  'mediumIndigo',
  'darkPurple',
  'grey',
  'darkLime',
  'mediumGreen',
  'darkPink',
  'darkRed',
  'darkOrange',
  'lightAqua',
  'darkYellow',
  'lightTurquoise',
  'mediumPurple',
  'lightBlue',
  'lightGreen',
  'mediumLime',
  'lightIndigo',
  'mediumPink',
  'mediumRed',
  'lightLime',
  'lightPurple',
  'mediumOrange',
  'lightRed',
  'lightPink',
  'lightOrange',
  'mediumYellow',
  'lightYellow',
] as const;
export type HouseholdColorName = typeof householdColors[number];
export type HouseholdColor = HouseholdColorName | 'clear';

export const householdColorToHex: Record<
  HouseholdColor,
  HouseholdColorHex | 'clear'
> = {
  black: '#000000',
  clear: 'clear',
  darkAqua: '#187F81',
  darkBlue: '#014F77',
  darkGreen: '#478837',
  darkIndigo: '#2F2A89',
  darkLime: '#73851A',
  darkOrange: '#8C3507',
  darkPink: '#831747',
  darkPurple: '#661B86',
  darkRed: '#841717',
  darkTurqouise: '#1F7F5C',
  darkYellow: '#977316',
  grey: '#6D6D6D',
  lightAqua: '#93E9EB',
  lightBlue: '#B3DAEE',
  lightGreen: '#BBF1AD',
  lightIndigo: '#CAC7F7',
  lightLime: '#DFEF95',
  lightOrange: '#F7BC9E',
  lightPink: '#F1A9C9',
  lightPurple: '#E5C0F5',
  lightRed: '#F1A8A8',
  lightTurquoise: '#99E9CC',
  lightYellow: '#FDDF91',
  mediumAqua: '#28D4D7',
  mediumBlue: '#0284C7',
  mediumGreen: '#77E25B',
  mediumIndigo: '#4F46E5',
  mediumLime: '#C0DE2B',
  mediumOrange: '#EA580C',
  mediumPink: '#DB2777',
  mediumPurple: '#AA2DDF',
  mediumRed: '#DC2626',
  mediumTurqouise: '#34D399',
  mediumYellow: '#FBBF24',
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
