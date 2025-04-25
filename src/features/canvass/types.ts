import {
  Household,
  Visit,
  ZetkinLocation,
} from 'features/areaAssignments/types';

export type ZetkinLocationVisit = {
  areaAssId: number;
  id: string;
  locationId: number;
  personId: number;
  responses: {
    metricId: string;
    responseCounts: number[];
  }[];
  timestamp: string;
};

export type ZetkinLocationVisitPostBody = Omit<
  ZetkinLocationVisit,
  'id' | 'timestamp' | 'personId'
>;

export type ZetkinLocationPostBody = Partial<
  Omit<ZetkinLocation, 'id' | 'households'>
>;

export type ZetkinLocationPatchBody = Partial<
  Omit<ZetkinLocation, 'id' | 'households'>
> & {
  households?: Partial<Omit<Household, 'id' | 'visits'>> &
    { visits?: Partial<Omit<Visit, 'id'>>[] }[];
};

export type Zetkin2Household = {
  id: number;
  level: number;
  location_id: number;
  title: string;
};

export type HouseholdPatchBody = Partial<Omit<Zetkin2Household, 'id'>>;
