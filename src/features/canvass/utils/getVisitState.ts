import { Household } from '../../areaAssignments/types';

export type ProgressState = 'none' | 'some' | 'all';

export default function getVisitState(
  households: Household[],
  areaAssId: string | null
): ProgressState {
  let numberOfVisitedHouseholds = 0;
  households.forEach((household) => {
    const hasVisitsInCurrentAssignment = household.visits.some((visit) => {
      return visit.areaAssId == areaAssId;
    });

    if (hasVisitsInCurrentAssignment) {
      numberOfVisitedHouseholds++;
    }
  });

  if (
    numberOfVisitedHouseholds > 0 &&
    numberOfVisitedHouseholds == households.length
  ) {
    return 'all';
  } else if (
    numberOfVisitedHouseholds > 0 &&
    numberOfVisitedHouseholds < households.length
  ) {
    return 'some';
  } else {
    return 'none';
  }
}
