import { HouseholdWithColor } from 'features/canvass/types';

export type HouseholdItem = {
  household: HouseholdWithColor;
  lastVisitSuccess: boolean;
  lastVisitTime: string;
};
