import { ZetkinLocationVisit } from '../types';

export default function estimateVisitedHouseholds(
  visit: ZetkinLocationVisit
): number {
  const householdsPerMetric = visit.metrics.map((response) => {
    if ('num_no' in response) {
      return response.num_no + response.num_yes;
    } else {
      return response.num_values.reduce((sum, count) => sum + count, 0);
    }
  });
  return Math.max(0, ...householdsPerMetric);
}
