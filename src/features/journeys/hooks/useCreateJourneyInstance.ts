import { IFuture, PromiseFuture } from 'core/caching/futures';
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
) => IFuture<ZetkinJourneyInstance> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return (
    instanceBody: ZetkinJourneyInstancePostBody
  ): IFuture<ZetkinJourneyInstance> => {
    dispatch(journeyInstanceCreate());

    const promise = apiClient
      .post<ZetkinJourneyInstance, ZetkinJourneyInstancePostBody>(
        `/api/journeyInstances/createNew?orgId=${orgId}&journeyId=${journeyId}`,
        instanceBody
      )
      .then((journeyInstance: ZetkinJourneyInstance) => {
        dispatch(journeyInstanceCreated(journeyInstance));
        return journeyInstance;
      });

    return new PromiseFuture(promise);
  };
}
