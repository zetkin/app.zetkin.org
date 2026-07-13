import { ZetkinLocation } from 'features/areaAssignments/types';
import estimateVisitedHouseholds from '../utils/estimateVisitedHouseholds';
import useLocationVisits from './useLocationVisits';
import useVisitReporting from './useVisitReporting';

type BasicLocationStats = {
  numHouseholds: number;
  numSuccessfulHouseholds: number | null;
  numVisitedHouseholds: number | null;
};
export default function useBasicLocationStats(
  assignmentId: number,
  location: ZetkinLocation
): BasicLocationStats {
  const visits = useLocationVisits(
    location.organization_id,
    assignmentId,
    location.id
  );

  const { lastVisitByHouseholdId } = useVisitReporting(
    location.organization_id,
    assignmentId,
    location.id
  );

  const numHouseholdsVisitedIndividually = Object.keys(
    lastVisitByHouseholdId
  ).length;

  const numHouseholdsPerLocationVisit =
    visits.map(estimateVisitedHouseholds) ?? [];

  const numVisitedHouseholds = Math.max(
    0,
    numHouseholdsVisitedIndividually,
    ...numHouseholdsPerLocationVisit
  );

  const numHouseholds = Math.max(
    location.num_known_households || location.num_estimated_households,
    numVisitedHouseholds
  );

  return {
    numHouseholds,
    numSuccessfulHouseholds: location.num_households_successful,
    numVisitedHouseholds,
  };
}
