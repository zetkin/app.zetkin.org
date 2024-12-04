import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  placesLoad,
  placesLoaded,
  visitsInvalidated,
  visitsLoad,
  visitsLoaded,
} from '../store';

type UseSidebarReturn = {
  loading: boolean;
  stats: {
    allTime: {
      numHouseholds: number;
      numPlaces: number;
    };
    today: {
      numHouseholds: number;
      numPlaces: number;
      numUserHouseholds: number;
      numUserPlaces: number;
    };
  };
  sync: () => void;
  synced: string | null;
};

export default function useSidebarStats(
  orgId: number,
  assignmentId: string
): UseSidebarReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const placeList = useAppSelector(
    (state) => state.canvassAssignments.placeList
  );
  const visitList = useAppSelector(
    (state) => state.canvassAssignments.visitsByAssignmentId[assignmentId]
  );

  const placeListFuture = loadListIfNecessary(placeList, dispatch, {
    actionOnLoad: () => placesLoad(),
    actionOnSuccess: (items) => placesLoaded(items),
    loader: () => apiClient.get(`/beta/orgs/${orgId}/places`),
  });

  const visitListFuture = loadListIfNecessary(visitList, dispatch, {
    actionOnLoad: () => visitsLoad(assignmentId),
    actionOnSuccess: (items) => visitsLoaded([assignmentId, items]),
    loader: () =>
      apiClient.get(
        `/beta/orgs/${orgId}/canvassassignments/${assignmentId}/visits`
      ),
  });

  const stats = {
    allTime: {
      numHouseholds: 0,
      numPlaces: 0,
    },
    today: {
      numHouseholds: 0,
      numPlaces: 0,
      numUserHouseholds: 0,
      numUserPlaces: 0,
    },
  };

  const userPlacesToday = new Set<string>();
  const teamPlacesToday = new Set<string>();
  const teamPlaces = new Set<string>();

  const userHouseholdsToday = new Set<string>();
  const teamHouseholdsToday = new Set<string>();
  const teamHouseholds = new Set<string>();

  const todayStr = new Date().toISOString().slice(0, 10);

  if (placeListFuture.data) {
    placeListFuture.data.forEach((place) => {
      place.households.forEach((household) => {
        household.visits.forEach((visit) => {
          if (visit.canvassAssId == assignmentId) {
            teamHouseholds.add(household.id);

            if (visit.timestamp.startsWith(todayStr)) {
              teamHouseholdsToday.add(household.id);

              // TODO: Check user
              userHouseholdsToday.add(household.id);
            }
          }
        });
      });
    });
  }

  stats.allTime.numHouseholds = teamHouseholds.size;
  stats.today.numHouseholds = teamHouseholdsToday.size;
  stats.today.numUserHouseholds = userHouseholdsToday.size;

  if (visitListFuture.data) {
    visitListFuture.data.forEach((visit) => {
      const householdsPerMetric = visit.responses.map((response) =>
        response.responseCounts.reduce((sum, value) => sum + value, 0)
      );
      const numHouseholds = Math.max(...householdsPerMetric);

      teamPlaces.add(visit.placeId);
      stats.allTime.numHouseholds += numHouseholds;

      if (visit.timestamp.startsWith(todayStr)) {
        teamPlacesToday.add(visit.placeId);
        stats.today.numHouseholds += numHouseholds;

        // TODO: Check user
        userPlacesToday.add(visit.placeId);
        stats.today.numUserHouseholds += numHouseholds;
      }
    });
  }

  stats.allTime.numPlaces = teamPlaces.size;
  stats.today.numPlaces = teamPlacesToday.size;
  stats.today.numUserPlaces = userPlacesToday.size;

  return {
    loading: placeListFuture.isLoading || visitListFuture.isLoading,
    stats,
    sync: () => {
      dispatch(visitsInvalidated(assignmentId));
    },
    synced: visitList?.loaded || null,
  };
}
