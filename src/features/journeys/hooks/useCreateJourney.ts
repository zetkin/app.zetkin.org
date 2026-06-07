import { journeyLoad } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinCreateJourney, ZetkinJourney } from 'utils/types/zetkin';

export default function useCreateJourney(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const createJourney = async (
    body: ZetkinCreateJourney
  ): Promise<ZetkinJourney> => {
    const journey = await apiClient.post<ZetkinJourney, ZetkinCreateJourney>(
      `/api/orgs/${orgId}/journeys`,
      body
    );
    dispatch(journeyLoad(journey.id));
    return journey;
  };
  return createJourney;
}
