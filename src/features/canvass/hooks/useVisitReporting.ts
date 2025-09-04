import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  MetricBulkResponse,
  MetricResponse,
  ZetkinHouseholdVisit,
  ZetkinHouseholdVisitPostBody,
  ZetkinLocationVisit,
  ZetkinLocationVisitPostBody,
} from '../types';
import { locationLoaded } from 'features/areaAssignments/store';
import {
  visitCreated,
  householdVisitCreated as householdVisitCreated,
  visitUpdated,
} from '../store';
import useAreaAssignment from 'features/areaAssignments/hooks/useAreaAssignment';
import useLocalStorage from 'zui/hooks/useLocalStorage';
import useLocationVisits from './useLocationVisits';
import useUser from 'core/hooks/useUser';
import summarizeMetrics from '../utils/summarizeMetrics';
import { ZetkinLocation } from 'features/areaAssignments/types';
import submitHouseholdVisits from '../rpc/submitHouseholdVisits';
import useLocationHouseholdVisits from './useLocationHouseholdVisits';

type VisitByHouseholdIdMap = Record<
  number,
  {
    created: string;
    metrics: MetricResponse[];
  }
>;

export type UseVisitReportingReturn = {
  currentLocationVisit: ZetkinLocationVisit | null;
  lastVisitByHouseholdId: VisitByHouseholdIdMap;
  reportHouseholdVisit: (
    householdId: number,
    responses: MetricResponse[]
  ) => Promise<void>;
  reportHouseholdVisits: (
    householdsId: number[],
    responses: MetricResponse[]
  ) => Promise<void>;
  reportLocationVisit: (
    numHouseholdsVisited: number,
    responses: MetricBulkResponse[]
  ) => Promise<void>;
};

export default function useVisitReporting(
  orgId: number,
  assignmentId: number,
  locationId: number
): UseVisitReportingReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const assignment = useAreaAssignment(orgId, assignmentId).data;
  const locationVisits = useLocationVisits(orgId, assignmentId, locationId);
  const apiVisits = useLocationHouseholdVisits(orgId, assignmentId, locationId);
  const user = useUser();
  const [lastVisitByHouseholdId, setLastVisitByHouseholdId] =
    useLocalStorage<VisitByHouseholdIdMap>(
      `visitsInAssignmentAndLocation-${assignmentId}-${locationId}`,
      {}
    );

  apiVisits.forEach((visit) => {
    const existingVisit = lastVisitByHouseholdId[visit.household_id];
    if (existingVisit) {
      const existingVisitTimestamp = new Date(existingVisit.created);
      const apiVisitTimestamp = new Date(visit.created);
      if (apiVisitTimestamp > existingVisitTimestamp) {
        lastVisitByHouseholdId[visit.household_id] = visit;
      }
    } else {
      lastVisitByHouseholdId[visit.household_id] = visit;
    }
  });

  const now = new Date();
  const currentLocationVisit =
    locationVisits.find((visit) => {
      if (visit.created_by_user_id != user?.id) {
        return false;
      }

      const todayStr = now.toISOString().slice(0, 10);
      if (visit.created.slice(0, 10) != todayStr) {
        return false;
      }

      return true;
    }) || null;

  async function refreshLocationStats() {
    const updatedLoc = await apiClient.get<ZetkinLocation>(
      `/api2/orgs/${orgId}/area_assignments/${assignmentId}/locations/${locationId}`
    );
    dispatch(locationLoaded([assignmentId, updatedLoc]));
  }

  return {
    currentLocationVisit,
    lastVisitByHouseholdId,
    async reportHouseholdVisit(householdId, responses) {
      if (assignment?.reporting_level == 'location') {
        const updated = {
          ...lastVisitByHouseholdId,
          [householdId]: {
            created: new Date().toISOString(),
            metrics: responses,
          },
        };

        setLastVisitByHouseholdId(updated);

        const visitData = summarizeMetrics(
          Object.entries(updated).map(([id, info]) => ({
            household_id: parseInt(id),
            metrics: info.metrics,
          }))
        );

        if (currentLocationVisit) {
          const visit = await apiClient.patch<
            ZetkinLocationVisit,
            ZetkinLocationVisitPostBody
          >(
            `/api2/orgs/${orgId}/area_assignments/${assignmentId}/locations/${locationId}/visits/${currentLocationVisit.id}`,
            visitData
          );

          dispatch(visitUpdated(visit));
          await refreshLocationStats();
        } else {
          const visit = await apiClient.post<
            ZetkinLocationVisit,
            ZetkinLocationVisitPostBody
          >(
            `/api2/orgs/${orgId}/area_assignments/${assignmentId}/locations/${locationId}/visits`,
            visitData
          );

          dispatch(visitCreated(visit));
          await refreshLocationStats();
        }
      } else {
        const visit = await apiClient.post<
          ZetkinHouseholdVisit,
          ZetkinHouseholdVisitPostBody
        >(
          `/api2/orgs/${orgId}/area_assignments/${assignmentId}/households/${householdId}/visits`,
          {
            metrics: responses,
          }
        );

        dispatch(householdVisitCreated([locationId, visit]));
        await refreshLocationStats();
      }
    },
    async reportHouseholdVisits(
      householdIds: number[],
      responses: MetricResponse[]
    ) {
      if (assignment?.reporting_level == 'location') {
        const nowStr = new Date().toISOString();
        const updated: VisitByHouseholdIdMap = { ...lastVisitByHouseholdId };
        householdIds.forEach((householdId) => {
          updated[householdId] = {
            created: nowStr,
            metrics: responses,
          };
        });

        setLastVisitByHouseholdId(updated);

        const visitData = summarizeMetrics(
          Object.entries(updated).map(([id, info]) => ({
            household_id: parseInt(id),
            metrics: info.metrics,
          }))
        );

        if (currentLocationVisit) {
          const visit = await apiClient.patch<
            ZetkinLocationVisit,
            ZetkinLocationVisitPostBody
          >(
            `/api2/orgs/${orgId}/area_assignments/${assignmentId}/locations/${locationId}/visits/${currentLocationVisit.id}`,
            visitData
          );
          dispatch(visitUpdated(visit));
        } else {
          const visit = await apiClient.post<
            ZetkinLocationVisit,
            ZetkinLocationVisitPostBody
          >(
            `/api2/orgs/${orgId}/area_assignments/${assignmentId}/locations/${locationId}/visits`,
            visitData
          );
          dispatch(visitCreated(visit));
        }

        await refreshLocationStats();
      } else {
        const result = await apiClient.rpc(submitHouseholdVisits, {
          assignmentId: assignmentId,
          households: householdIds,
          orgId: orgId,
          responses: responses,
        });
        result.visits.forEach((visit) =>
          dispatch(householdVisitCreated([locationId, visit]))
        );
        await refreshLocationStats();
      }
    },
    async reportLocationVisit(numHouseholdsVisited, responses) {
      const visit = await apiClient.post<
        ZetkinLocationVisit,
        ZetkinLocationVisitPostBody
      >(
        `/api2/orgs/${orgId}/area_assignments/${assignmentId}/locations/${locationId}/visits`,
        {
          metrics: responses,
          num_households_visited: numHouseholdsVisited,
        }
      );

      dispatch(visitCreated(visit));
      await refreshLocationStats();
    },
  };
}
