import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import { userEventsLoad, userEventsLoaded } from '../store';
import { ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';

export default function useMyEvents() {
  const apiClient = useApiClient();
  const list = useAppSelector((state) => state.events.userEventList);

  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  return useRemoteList(list, {
    actionOnLoad: () => userEventsLoad(),
    actionOnSuccess: (data) => userEventsLoaded(data),
    loader: async () => {
      const bookedEventIds: number[] = [];

      const bookedEvents = await apiClient
        .get<ZetkinEvent[]>(`/api/users/me/actions?filter=end_time>=${today}`)
        .then((events) =>
          events.map<ZetkinEventWithStatus>((event) => {
            bookedEventIds.push(event.id);
            return {
              ...event,
              status: 'booked',
            };
          })
        );

      const signedUpEvents = await apiClient
        .get<{ action: ZetkinEvent }[]>(`/api/users/me/action_responses`)
        .then((events) =>
          events
            .map<ZetkinEventWithStatus>((signup) => ({
              ...signup.action,
              status: 'signedUp',
            }))
            .filter((event) => !bookedEventIds.includes(event.id))
            .filter(({ end_time }) => end_time >= today)
        );

      return [...bookedEvents, ...signedUpEvents];
    },
  });
}
