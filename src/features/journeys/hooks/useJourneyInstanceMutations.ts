import { ZetkinJourneyInstance } from 'utils/types/zetkin';
import { journeyInstanceUpdate, journeyInstanceUpdated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

type ZetkinJourneyInstancePatchBody = Partial<
  Pick<
    ZetkinJourneyInstance,
    'title' | 'summary' | 'opening_note' | 'outcome' | 'closed'
  > & { journey_id: number }
>;

interface UseJourneyInstanceMutationsReturn {
  updateJourneyInstance: (
    patchBody: ZetkinJourneyInstancePatchBody
  ) => Promise<ZetkinJourneyInstance>;
}

export default function useJourneyInstanceMutations(
  orgId: number,
  instanceId: number
): UseJourneyInstanceMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  async function updateJourneyInstance(
    patchBody: ZetkinJourneyInstancePatchBody
  ) {
    const mutatingAttributes = Object.keys(patchBody);
    dispatch(journeyInstanceUpdate([instanceId, mutatingAttributes]));
    const updatedInstance = await apiClient.patch<ZetkinJourneyInstance>(
      `/api/orgs/${orgId}/journey_instances/${instanceId}`,
      patchBody
    );
    dispatch(journeyInstanceUpdated(updatedInstance));
    return updatedInstance;
  }

  return { updateJourneyInstance };
}
