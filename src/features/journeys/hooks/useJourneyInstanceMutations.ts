import { JourneyInstanceCloseBody } from 'pages/api/journeyInstances/close';
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
  closeJourneyInstance: (closeBody: JourneyInstanceCloseBody) => Promise<void>;
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

  async function closeJourneyInstance(closeBody: JourneyInstanceCloseBody) {
    const mutatingAttributes = Object.keys(closeBody);
    dispatch(journeyInstanceUpdate([instanceId, mutatingAttributes]));

    const closedInstance = await apiClient.post<ZetkinJourneyInstance>(
      `/api/journeyInstances/close?orgId=${orgId}&instanceId=${instanceId}`,
      closeBody
    );
    dispatch(journeyInstanceUpdated(closedInstance));
  }

  return { closeJourneyInstance, updateJourneyInstance };
}
