import { useApiClient, useAppSelector } from 'core/hooks';
import { visitsLoad, visitsLoaded } from '../store';
import useRemoteList from 'core/hooks/useRemoteList';
import { ZetkinLocationVisit } from '../types';
import { fetchAllPaginated } from 'utils/fetchAllPaginated';

export default function useLocationVisits(
  orgId: number,
  assignmentId: number,
  locationId: number
) {
  const apiClient = useApiClient();
  const visitList = useAppSelector(
    (state) => state.canvass.visitsByAssignmentId[assignmentId]
  );

  const visits = useRemoteList(visitList, {
    actionOnLoad: () => visitsLoad(assignmentId),
    actionOnSuccess: (items) => visitsLoaded([assignmentId, items]),
    loader: async () =>
      fetchAllPaginated<ZetkinLocationVisit>((page) =>
        apiClient.get(
          `/api2/orgs/${orgId}/area_assignments/${assignmentId}/locations/${locationId}/visits?size=100&page=${page}`
        )
      ),
  });

  return visits.filter((visit) => visit.location_id == locationId);
}
