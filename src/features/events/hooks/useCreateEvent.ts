import { useRouter } from 'next/router';

import getEventUrl from '../utils/getEventUrl';
import { ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventPostBody } from './useEventMutations';
import { eventCreate, eventCreated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

export default function useCreateEvent(orgId: number) {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();
  const router = useRouter();

  return async (eventBody: ZetkinEventPostBody, redirect = true) => {
    dispatch(eventCreate());
    const event = await apiClient.post<ZetkinEvent, ZetkinEventPostBody>(
      `/api/orgs/${orgId}/${
        eventBody.campaign_id ? `campaigns/${eventBody.campaign_id}/` : ''
      }actions`,
      eventBody
    );
    dispatch(eventCreated(event));

    if (redirect) {
      router.push(getEventUrl(event));
    }

    return event;
  };
}
