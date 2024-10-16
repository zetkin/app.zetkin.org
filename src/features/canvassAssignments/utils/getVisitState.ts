import { Household } from '../types';

export type VisitState = 'pending' | 'started' | 'done';

export default function getVisitState(
  households: Household[],
  canvassAssId: string | null
): VisitState {
  let numberOfVisitedHouseholds = 0;
  households.forEach((household) => {
    const hasVisitsInCurrentAssignment = household.visits.some((visit) => {
      return visit.canvassAssId == canvassAssId;
    });

    if (hasVisitsInCurrentAssignment) {
      numberOfVisitedHouseholds++;
    }
  });

  if (
    numberOfVisitedHouseholds > 0 &&
    numberOfVisitedHouseholds == households.length
  ) {
    return 'done';
  } else if (
    numberOfVisitedHouseholds > 0 &&
    numberOfVisitedHouseholds < households.length
  ) {
    return 'started';
  } else {
    return 'pending';
  }
}
