import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';

import { useMessages } from 'core/i18n';
import messageIds from 'features/campaigns/l10n/messageIds';
import useEventsFromDateRange from 'features/events/hooks/useEventsFromDateRange';
import { useNumericRouteParams } from 'core/hooks';

const EventList: FC<{ orgId: number }> = ({ orgId }) => {
  const router = useRouter();
  const messages = useMessages(messageIds);

  const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);

  // const endDate = new Date(
  //   typeof router.query.maxDate === 'string' ? router.query.maxDate : ''
  // );
  // const startDate = new Date(
  //   typeof router.query.minDate === 'string' ? router.query.minDate : ''
  // );

  const endDate = new Date('2024-12-31');
  const startDate = new Date('2020-12-31');

  useEffect(() => {
    const { ids } = router.query;
    if (typeof ids !== 'string') {
      return;
    }

    const parsedIds = ids.split(',').map((x) => Number(x));

    setSelectedEventIds(parsedIds);
  }, [router.query]);

  const stuff = useEventsFromDateRange(startDate, endDate, orgId);

  const filteredEvents = stuff.filter((x) =>
    selectedEventIds.includes(x.data.id)
  );

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
