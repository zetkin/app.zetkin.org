import getEventUrl from '../utils/getEventUrl';
import { useRouter } from 'next/router';
import { ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventPostBody } from './useEventMutations';
import { eventCreate, eventCreated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

type useCreateEventReturn = {
  createEvent: (eventBody: ZetkinEventPostBody) => Promise<ZetkinEvent>;
};

export default function useCreateEvent(orgId: number): useCreateEventReturn {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();
  const router = useRouter();

  const createEvent = async (eventBody: ZetkinEventPostBody) => {
    dispatch(eventCreate());
    const event = await apiClient.post<ZetkinEvent, ZetkinEventPostBody>(
      `/api/orgs/${orgId}/${
        eventBody.campaign_id ? `campaigns/${eventBody.campaign_id}/` : ''
      }actions`,
      eventBody
    );
    dispatch(eventCreated(event));
    router.push(getEventUrl(event));

    return event;
  };

  return { createEvent };
}
