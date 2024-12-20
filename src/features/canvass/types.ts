import {
  Household,
  Visit,
  ZetkinAreaAssignment,
  ZetkinLocation,
} from 'features/areaAssignments/types';
import { ZetkinArea } from 'features/geography/types';

export type AssignmentWithAreas = ZetkinAreaAssignment & {
  areas: ZetkinArea[];
};

export type ZetkinLocationVisit = {
  areaAssId: string;
  id: string;
  locationId: string;
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

export type HouseholdPatchBody = Partial<Omit<Household, 'id'>>;
