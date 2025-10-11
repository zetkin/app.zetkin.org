import { ZetkinArea } from '../areas/types';
import { ZetkinAreaAssignee } from '../areaAssignments/types';

export type ZetkinHouseholdsAssignment = {
  campId: number;
  id: string;
  orgId: number;
  title: string | null;
};

export type ZetkinHouseholdsPostBody = Partial<Omit<ZetkinArea, 'id'>>;

export type ZetkinHouseholdsAssignmentPostBody = Partial<
  Omit<ZetkinHouseholdsAssignment, 'id'>
>;

export type ZetkinHouseholdAssignee = {
  assignment_id: number;
  household_id: number;
  user_id: number;
};
