import { journeyInstanceCreate, journeyInstanceCreated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinJourneyInstance,
  ZetkinPerson,
  ZetkinTag,
} from 'utils/types/zetkin';

interface ZetkinJourneyInstancePostBody {
  assignees: ZetkinPerson[];
  note: string;
  subjects: ZetkinPerson[];
  tags: ZetkinTag[];
  title: string;
}

export default function useCreateJourneyInstance(
  orgId: number,
  journeyId: number
): (
  instanceBody: ZetkinJourneyInstancePostBody
) => Promise<ZetkinJourneyInstance> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async function (
    instanceBody: ZetkinJourneyInstancePostBody
  ): Promise<ZetkinJourneyInstance> {
    dispatch(journeyInstanceCreate());

    const journeyInstance = await apiClient.post<
      ZetkinJourneyInstance,
      ZetkinJourneyInstancePostBody
    >(
      `/api/journeyInstances/createNew?orgId=${orgId}&journeyId=${journeyId}`,
      instanceBody
    );

    dispatch(journeyInstanceCreated(journeyInstance));

    return journeyInstance;
  };
}
