import { Household } from 'features/areaAssignments/types';

export interface VisitStats {
  totalSuccessfulVisits: number;
  totalVisits: number;
}

export function getVisitPercentage(
  areaAssId: string | null,
  households: Household[],
  metricDefinesDone: string | null
): VisitStats {
  if (households.length === 0) {
    return { totalSuccessfulVisits: 0, totalVisits: 0 };
  }
  if (!metricDefinesDone) {
    return { totalSuccessfulVisits: 0, totalVisits: 0 };
  }
  const numberOfVisitedHouseholds = households.filter((household) =>
    household.visits.some((visit) => visit.areaAssId === areaAssId)
  ).length;

  const successfulVisits = households.filter((household) =>
    household.visits.some(
      (visit) =>
        visit.areaAssId === areaAssId &&
        visit.responses.some(
          (response) =>
            response.metricId === metricDefinesDone &&
            response.response.toLowerCase() === 'yes'
        )
    )
  ).length;

  const computedTotalVisits = Math.round(
    (numberOfVisitedHouseholds / households.length) * 100
  );
  const computedTotalSuccessfulVisits = Math.round(
    (successfulVisits / households.length) * 100
  );

  let totalVisits: number;
  if (computedTotalVisits > 0) {
    if (computedTotalVisits > 80 && computedTotalVisits < 100) {
      totalVisits = 80;
    } else {
      totalVisits = Math.max(25, computedTotalVisits);
    }
  } else {
    totalVisits = 0;
  }

  let totalSuccessfulVisits: number;
  if (computedTotalSuccessfulVisits > 0) {
    if (
      computedTotalSuccessfulVisits > 80 &&
      computedTotalSuccessfulVisits < 100
    ) {
      totalSuccessfulVisits = 80;
    } else {
      totalSuccessfulVisits = Math.max(25, computedTotalSuccessfulVisits);
    }
  } else {
    totalSuccessfulVisits = 0;
  }

  return { totalSuccessfulVisits, totalVisits };
}
