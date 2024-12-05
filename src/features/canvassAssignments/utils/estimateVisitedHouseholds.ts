import { ZetkinPlaceVisit } from '../types';

export default function estimateVisitedHouseholds(
  visit: ZetkinPlaceVisit
): number {
  const householdsPerMetric = visit.responses.map((response) =>
    response.responseCounts.reduce((sum, value) => sum + value)
  );
  return Math.max(...householdsPerMetric);
}
