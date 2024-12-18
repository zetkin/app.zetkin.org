import { ZetkinLocationVisit } from '../types';

export default function estimateVisitedHouseholds(
  visit: ZetkinLocationVisit
): number {
  const householdsPerMetric = visit.responses.map((response) =>
    response.responseCounts.reduce((sum, value) => sum + value)
  );
  return Math.max(0, ...householdsPerMetric);
}
