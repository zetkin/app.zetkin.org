import { getUTCDateWithoutTime } from 'utils/dateUtils';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { ACTIVITIES, ProjectActivity } from '../types';
import {
  callAssignmentsLoad,
  callAssignmentsLoaded,
  projectCallAssignmentsLoad,
  projectCallAssignmentsLoaded,
} from 'features/callAssignments/store';
import {
  ErrorFuture,
  IFuture,
  LoadingFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useCallAssignmentActivities(
  orgId: number,
  projectId?: number
): IFuture<ProjectActivity[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const callAssignmentsSlice = useAppSelector((state) => state.callAssignments);

  const activities: ProjectActivity[] = [];

  if (projectId) {
    const callAssignmentIdsByProjectId =
      callAssignmentsSlice.callAssignmentIdsByProjectId[projectId];
    const callAssignmentIdsFuture = loadListIfNecessary(
      callAssignmentIdsByProjectId,
      dispatch,
      {
        actionOnLoad: () => projectCallAssignmentsLoad(projectId),
        actionOnSuccess: (data) =>
          projectCallAssignmentsLoaded([projectId, data]),
        loader: async () => {
          const callAssignments = await apiClient.get<ZetkinCallAssignment[]>(
            `/api/orgs/${orgId}/campaigns/${projectId}/call_assignments`
          );
          return callAssignments.map((ca) => ({ id: ca.id }));
        },
      }
    );

    if (callAssignmentIdsFuture.isLoading) {
      return new LoadingFuture();
    } else if (callAssignmentIdsFuture.error) {
      return new ErrorFuture(callAssignmentIdsFuture.error);
    }

    const callAssignmentList = callAssignmentsSlice.assignmentList;
    const callAssignmentsFuture = loadListIfNecessary(
      callAssignmentList,
      dispatch,
      {
        actionOnLoad: () => callAssignmentsLoad(),
        actionOnSuccess: (data) => callAssignmentsLoaded(data),
        loader: () =>
          apiClient.get<ZetkinCallAssignment[]>(
            `/api/orgs/${orgId}/campaigns/${projectId}/call_assignments`
          ),
      }
    );

    if (callAssignmentsFuture.isLoading) {
      return new LoadingFuture();
    } else if (callAssignmentsFuture.error) {
      return new ErrorFuture(callAssignmentsFuture.error);
    }

    if (callAssignmentIdsFuture.data && callAssignmentsFuture.data) {
      const callAssignments = callAssignmentsFuture.data;
      const callAssignmentIds = callAssignmentIdsFuture.data;

      callAssignmentIds.forEach(({ id: caId }) => {
        const ca = callAssignments.find((item) => item.id === caId);

        if (ca) {
          activities.push({
            data: ca,
            kind: ACTIVITIES.CALL_ASSIGNMENT,
            visibleFrom: getUTCDateWithoutTime(ca.start_date),
            visibleUntil: getUTCDateWithoutTime(ca.end_date),
          });
        }
      });
    }
  } else {
    const callAssignmentList = callAssignmentsSlice.assignmentList;
    const allCallAssignmentsFuture = loadListIfNecessary(
      callAssignmentList,
      dispatch,
      {
        actionOnLoad: () => callAssignmentsLoad(),
        actionOnSuccess: (data) => callAssignmentsLoaded(data),
        loader: () =>
          apiClient.get<ZetkinCallAssignment[]>(
            `/api/orgs/${orgId}/call_assignments`
          ),
      }
    );

    if (allCallAssignmentsFuture.data) {
      const allCallAssignments = allCallAssignmentsFuture.data;
      allCallAssignments.forEach((ca) => {
        activities.push({
          data: ca,
          kind: ACTIVITIES.CALL_ASSIGNMENT,
          visibleFrom: getUTCDateWithoutTime(ca.start_date),
          visibleUntil: getUTCDateWithoutTime(ca.end_date),
        });
      });
    }
  }

  return new ResolvedFuture(activities);
}
