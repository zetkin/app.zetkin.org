import createRemoteListResource from 'core/resources/createRemoteListResource';
import { userEventsLoad, userEventsLoaded } from 'features/events/store';
import { ZetkinEventWithStatus } from 'features/public/types';
import { ZetkinEvent } from 'utils/types/zetkin';

const myEventsResource = createRemoteListResource<
  { today: string },
  ZetkinEventWithStatus
>(({ today }: { today: string }) => ({
  actionOnLoad: () => userEventsLoad(),
  actionOnSuccess: (events) => userEventsLoaded(events),
  cacheKey: `user-events:${today}`,
  loader: async (apiClient) => {
    const bookedEventIds: number[] = [];

    try {
      const bookedEvents = await apiClient
        .get<ZetkinEvent[]>(`/api/users/me/actions?filter=end_time>=${today}`)
        .then((events) =>
          events.map<ZetkinEventWithStatus>((event) => {
            bookedEventIds.push(event.id);
            return { ...event, status: 'booked' };
          })
        );

      const signedUpEvents = await apiClient
        .get<{ action: ZetkinEvent }[]>('/api/users/me/action_responses')
        .then((responses) =>
          responses
            .map<ZetkinEventWithStatus>(({ action }) => ({
              ...action,
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
  selector: (state) => state.events.userEventList,
}));

export default myEventsResource;
