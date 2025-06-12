'use server';

import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinEvent, ZetkinUser } from 'utils/types/zetkin';
import { PublicEventPage } from 'features/organizations/pages/PublicEventPage';
import { ZetkinEventWithStatus } from 'features/home/types';

type Props = {
  params: {
    eventId: string;
    orgId: number;
  };
};

export default async function Page({ params: { eventId, orgId } }: Props) {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const baseEvent = await apiClient.get<ZetkinEvent>(
    `/api/orgs/${orgId}/actions/${eventId}`
  );

  let user: ZetkinUser | null;
  try {
    user = await apiClient.get<ZetkinUser>('/api/users/me');
  } catch {
    user = null;
  }

  let userEvent: ZetkinEventWithStatus | null = null;

  if (user) {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);

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

    const userEvents = [...bookedEvents, ...signedUpEvents];

    userEvent = userEvents.find((e) => e.id == baseEvent.id) || null;
  }

  return (
    <PublicEventPage event={userEvent || { ...baseEvent, status: null }} />
  );
}
