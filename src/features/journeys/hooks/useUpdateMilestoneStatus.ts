import { invalidateJourneyInstance } from '../store';
import { ZetkinJourneyMilestoneStatus } from 'utils/types/zetkin';
import { useApiClient, useAppDispatch } from 'core/hooks';

export default function useUpdateMilestoneStatus(
  orgId: number,
  instanceId: number,
  milestoneId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async function (
    milestonePatchBody:
      | Pick<ZetkinJourneyMilestoneStatus, 'completed'>
      | Pick<ZetkinJourneyMilestoneStatus, 'deadline'>
  ) {
    await apiClient.patch<ZetkinJourneyMilestoneStatus>(
      `/api/orgs/${orgId}/journey_instances/${instanceId}/milestones/${milestoneId}`,
      milestonePatchBody
    );
    dispatch(invalidateJourneyInstance(instanceId));
  };
}
