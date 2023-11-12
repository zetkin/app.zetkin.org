import { FC, useState } from 'react';

import EventSignUpList from 'features/events/components/EventSignUpList';
import notEmpty from 'utils/notEmpty';
import useEventsFromDateRange from 'features/events/hooks/useEventsFromDateRange';
import { ZetkinEvent } from 'utils/types/zetkin';
import { Autocomplete, TextField } from '@mui/material';

const EventListing: FC = () => {
  const [selectedActivities, setSelectedActivities] = useState<
    NonNullable<ZetkinEvent['activity']>[]
  >([]);

  const eventActivitiesFromDateRange = useEventsFromDateRange(
    new Date(),
    new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
  ); // TODO: Smarter date handling. We dont just want to do next 60 days.
  const events = eventActivitiesFromDateRange.map((activity) => activity.data);
  const activities = events.map((event) => event.activity).filter(notEmpty);
  const activityIds = activities.map((activity) => activity.id);
  const uniqueActivityIds = Array.from(new Set(activityIds));

  const uniqueActivities = uniqueActivityIds
    .map((id) => activities.find((activity) => activity.id == id))
    .filter(notEmpty);

  const filteredEvents = events.filter((event) => {
    const isRightActivity = selectedActivities.some(
      (activity) => event.activity?.id == activity.id
    );
    return !!event.activity && isRightActivity;
  });

  const sortedEvents = events.sort(
    (e0, e1) =>
      new Date(e0.start_time).getTime() - new Date(e1.start_time).getTime()
  );

  return (
    <>
      <Autocomplete
        getOptionLabel={(option) => option.title}
        multiple
        onChange={(event, value) => setSelectedActivities(value)}
        options={uniqueActivities || []}
        renderInput={(params) => (
          <TextField
            {...params}
            inputProps={{ ...params.inputProps }}
            label="Filter by activity type"
            variant="standard"
          />
        )}
        value={selectedActivities}
      />
      <EventSignUpList
        events={filteredEvents.length > 0 ? filteredEvents : sortedEvents}
      />
    </>
  );
};

export default EventListing;
