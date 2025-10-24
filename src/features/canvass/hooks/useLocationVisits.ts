import { useApiClient, useAppSelector } from 'core/hooks';
import { visitsLoad, visitsLoaded } from '../store';
import useRemoteList from 'core/hooks/useRemoteList';
import { ZetkinLocationVisit } from '../types';

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
    cacheKey: `visits:${orgId}:${assignmentId}:${locationId}`,
    loader: () =>
      apiClient.get<ZetkinLocationVisit[]>(
        `/api2/orgs/${orgId}/area_assignments/${assignmentId}/locations/${locationId}/visits`
      ),
  });

  return visits.filter((visit) => visit.location_id == locationId);
}
