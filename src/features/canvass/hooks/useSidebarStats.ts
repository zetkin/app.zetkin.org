import { useAppDispatch, useAppSelector } from 'core/hooks';
import { locationsInvalidated } from '../../areaAssignments/store';
import { visitsInvalidated } from '../store';
import useMembership from 'features/organizations/hooks/useMembership';

type UseSidebarReturn = {
  loading: boolean;
  stats: {
    allTime: {
      numHouseholds: number;
      numLocations: number;
    };
    today: {
      numHouseholds: number;
      numLocations: number;
      numUserHouseholds: number;
      numUserLocations: number;
    };
  };
  sync: () => void;
  synced: string | null;
};

export default function useSidebarStats(
  orgId: number,
  assignmentId: number
): UseSidebarReturn {
  const dispatch = useAppDispatch();
  const visitList = useAppSelector(
    (state) => state.canvass.visitsByAssignmentId[assignmentId]
  );

  useMembership(orgId);

  // TODO: Get From API
  /*
  const visitListFuture = loadListIfNecessary(visitList, dispatch, {
    actionOnLoad: () => visitsLoad(assignmentId),
    actionOnSuccess: (items) => visitsLoaded([assignmentId, items]),
    loader: () =>
      apiClient.get(
        `/beta/orgs/${orgId}/areaassignments/${assignmentId}/visits`
      ),
  });
  */

  const stats = {
    allTime: {
      numHouseholds: 0,
      numLocations: 0,
    },
    today: {
      numHouseholds: 0,
      numLocations: 0,
      numUserHouseholds: 0,
      numUserLocations: 0,
    },
  };

  const userLocationsToday = new Set<string>();
  const teamLocationsToday = new Set<string>();
  const teamLocations = new Set<string>();

  // TODO: Get from API
  /*
  const todayStr = new Date().toISOString().slice(0, 10);
  const userHouseholdsToday = new Set<string>();
  const teamHouseholdsToday = new Set<string>();
  const teamHouseholds = new Set<string>();


  if (locationListFuture.data) {
    locationListFuture.data.forEach((location) => {
      location.households.forEach((household) => {
        household.visits.forEach((visit) => {
          if (visit.assignment_id == assignmentId) {
            teamHouseholds.add(household.id);

            if (visit.timestamp.startsWith(todayStr)) {
              teamHouseholdsToday.add(household.id);

              if (visit.personId == userPersonId) {
                userHouseholdsToday.add(household.id);
              }
            }
          }
        });
      });
    });
  }

  stats.allTime.numHouseholds = teamHouseholds.size;
  stats.today.numHouseholds = teamHouseholdsToday.size;
  stats.today.numUserHouseholds = userHouseholdsToday.size;
  */

  /*
  if (visitListFuture.data) {
    visitListFuture.data.forEach((visit) => {
      const numHouseholds = estimateVisitedHouseholds(visit);

      teamLocations.add(visit.locationId);
      stats.allTime.numHouseholds += numHouseholds;

      if (visit.timestamp.startsWith(todayStr)) {
        teamLocationsToday.add(visit.locationId);
        stats.today.numHouseholds += numHouseholds;

        if (visit.personId == userPersonId) {
          userLocationsToday.add(visit.locationId);
          stats.today.numUserHouseholds += numHouseholds;
        }
      }
    });
  }
    */

  stats.allTime.numLocations = teamLocations.size;
  stats.today.numLocations = teamLocationsToday.size;
  stats.today.numUserLocations = userLocationsToday.size;

  return {
    loading: false,
    stats,
    sync: () => {
      dispatch(visitsInvalidated(assignmentId));
      dispatch(locationsInvalidated());
    },
    synced: visitList?.loaded || null,
  };
}
