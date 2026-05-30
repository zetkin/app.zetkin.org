import { journeyLoad } from '../store';
import useTagging from 'features/tags/hooks/useTagging';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinCreateJourney, ZetkinJourney } from 'utils/types/zetkin';
import { TagToBeAdded } from 'features/profile/types';

export default function useCreateJourney(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const { assignToJourney } = useTagging(orgId);

  const createJourney = async (
    body: ZetkinCreateJourney,
    tags: TagToBeAdded[]
  ): Promise<ZetkinJourney> => {
    const journey = await apiClient.post<ZetkinJourney, ZetkinCreateJourney>(
      `/api/orgs/${orgId}/journeys`,
      body
    );
    dispatch(journeyLoad(journey.id));
    tags.map((tag) => {
      assignToJourney(journey.id, tag.id, tag.value);
    });
    return journey;
  };
  return createJourney;
}
