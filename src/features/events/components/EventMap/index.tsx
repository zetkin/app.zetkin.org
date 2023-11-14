import { Box } from '@mui/system';
import { LatLngLiteral } from 'leaflet';
import { useState } from 'react';

import { EventActivity } from 'features/campaigns/types';
import EventSignUpList from '../EventSignUpList';
import groupEventsByLocation from './groupEventsByLocation';
import LocationDrawer from './LocationDrawer';
import ZUIMap, { LocationWithData } from 'zui/ZUIMap';

const EventMap = ({
  center,
  events,
}: {
  center?: LatLngLiteral;
  events: EventActivity[];
}) => {
  const [selectedLocation, setSelectedLocation] =
    useState<LocationWithData<EventActivity>>();

  const locationsWithEvents = groupEventsByLocation(events);

  return (
    <Box height="100vh" position="relative">
      <ZUIMap
        center={center}
        locations={locationsWithEvents}
        onClickLocation={(location) => {
          setSelectedLocation(location);
        }}
        selectedLocation={selectedLocation}
      />

      <LocationDrawer
        onClose={() => {
          setSelectedLocation(undefined);
        }}
      >
        {selectedLocation && (
          <EventSignUpList
            events={selectedLocation?.data.map(({ data: event }) => event)}
          />
        )}
      </LocationDrawer>
    </Box>
  );
};

export default EventMap;
