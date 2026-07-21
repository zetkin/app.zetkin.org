import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import useRemoteListFuture from 'core/hooks/useRemoteListFuture';
import { IFuture } from 'core/caching/futures';
import { userEventsLoad, userEventsLoaded } from '../../events/store';
import { ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/public/types';

function useMyEventsList() {
  const apiClient = useApiClient();
  const list = useAppSelector((state) => state.events.userEventList);

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const url = `/api/users/me/actions?filter=end_time>=${today}`;

  return {
    hooks: {
      actionOnLoad: () => userEventsLoad(),
      actionOnSuccess: (data: ZetkinEventWithStatus[]) =>
        userEventsLoaded(data),
      cacheKey: url,
      loader: async () => {
        const bookedEventIds: number[] = [];

        try {
          const bookedEvents = await apiClient
            .get<ZetkinEvent[]>(url)
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
        } catch (err) {
          return [];
        }
      },
    },
    list,
  };
}

export default function useMyEvents() {
  const { hooks, list } = useMyEventsList();
  return useRemoteList(list, hooks);
}

export function useMyEventsFuture(): IFuture<ZetkinEventWithStatus[]> {
  const { hooks, list } = useMyEventsList();
  return useRemoteListFuture(list, hooks);
}
