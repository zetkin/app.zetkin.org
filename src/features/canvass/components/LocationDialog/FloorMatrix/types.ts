import { HouseholdWithColor } from 'features/canvass/types';

export type HouseholdItem = {
  household: HouseholdWithColor;
  lastVisitSuccess: boolean;
  lastVisitTime: string;
};

export type EditedFloor = {
  draftHouseholdCount: number;
  existingHouseholds: HouseholdWithColor[];
  level: number;
};
