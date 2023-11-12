import { FC } from 'react';

import EventSignUpList from 'features/events/components/EventSignUpList';
import useEventsFromDateRange from 'features/events/hooks/useEventsFromDateRange';

const EventListing: FC = () => {
  const eventsFromDateRange = useEventsFromDateRange(
    new Date(),
    new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
  ); // TODO: Smarter date handling. We dont just want to do next 60 days.

  // Sorting events by date. Closest date at the top
  const sortedEventsFromDateRange = eventsFromDateRange.sort(
    (e0, e1) =>
      new Date(e0.data.start_time).getTime() -
      new Date(e1.data.start_time).getTime()
  );
  return (
    <EventSignUpList
      events={sortedEventsFromDateRange.map((activity) => activity.data)}
    />
  );
};

export default EventListing;
