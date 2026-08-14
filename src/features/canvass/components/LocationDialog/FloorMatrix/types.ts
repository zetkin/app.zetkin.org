import { HouseholdWithColor, MetricResponse } from 'features/canvass/types';
import { ZetkinMetric } from 'features/areaAssignments/types';

export type HouseholdItem = {
  household: HouseholdWithColor;
  lastVisitMetrics: MetricResponse[] | null;
  lastVisitSuccess: boolean;
  lastVisitTime: string;
  metrics: ZetkinMetric[];
};

export type EditedFloor = {
  draftHouseholdCount: number;
  existingHouseholds: HouseholdWithColor[];
  level: number;
};
