import { ZetkinJourneyInstance } from 'utils/types/zetkin';
import { journeyInstanceUpdate, journeyInstanceUpdated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

interface UseJourneyInstanceMutationsReturn {
  updateJourneyInstance: (
    data: Partial<ZetkinJourneyInstance>
  ) => Promise<ZetkinJourneyInstance>;
}

export default function useJourneyInstanceMutations(
  orgId: number,
  instanceId: number
): UseJourneyInstanceMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  async function updateJourneyInstance(
    data: Partial<
      Pick<
        ZetkinJourneyInstance,
        'title' | 'summary' | 'opening_note' | 'outcome' | 'closed'
      > & { journey_id: number }
    >
  ) {
    const mutatingAttributes = Object.keys(data);
    dispatch(journeyInstanceUpdate([instanceId, mutatingAttributes]));
    const updatedInstance = await apiClient.patch<ZetkinJourneyInstance>(
      `/api/orgs/${orgId}/journey_instances/${instanceId}`,
      data
    );
    dispatch(journeyInstanceUpdated(updatedInstance));
    return updatedInstance;
  }

  return { updateJourneyInstance };
}
