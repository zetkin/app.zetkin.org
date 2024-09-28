import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';

import { useMessages } from 'core/i18n';
import messageIds from 'features/campaigns/l10n/messageIds';
import useEventsFromDateRange from 'features/events/hooks/useEventsFromDateRange';
import { useNumericRouteParams } from 'core/hooks';
import useDateRouterParam from 'features/events/hooks/useDateRouterParam';

const EventList: FC<{ orgId: number }> = ({ orgId }) => {
  const router = useRouter();
  const messages = useMessages(messageIds);

  const selectedEventIds = useMemo(() => {
    const { ids } = router.query;
    if (typeof ids !== 'string') {
      return [];
    }

    const parsedIds = ids.split(',').map((x) => Number(x));

    return parsedIds;
  }, [router.query]);

  // TODO: Date parsing is not correct
  const endDate = useDateRouterParam('minDate') || new Date();
  const startDate = useDateRouterParam('maxDate') || new Date();

  const filteredEvents = useEventsFromDateRange(
    startDate,
    endDate,
    orgId
  ).filter((x) => selectedEventIds.includes(x.data.id));

  return (
    <>
      <Head>
        <title>{messages.layout.eventList()}</title>
      </Head>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Activity</th>
            <th>Place</th>
          </tr>
        </thead>

        <tbody>
          {filteredEvents.map((item) => (
            <tr key={item.data.id}>
              <td>{new Date(item.data.end_time).toLocaleDateString()}</td>
              <td>{item.data.activity?.title}</td>
              <td>
                {item.data.location?.lat} {item.data.location?.lng}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEventIds.length === 0 && <p>No events selected.</p>}
    </>
  );
};

const Wrapper = () => {
  const { orgId } = useNumericRouteParams();
  if (!orgId) {
    return;
  }

  return <EventList orgId={orgId} />;
};

export default Wrapper;
