import { EventActivity } from 'features/campaigns/types';
import { LocationWithData } from 'zui/ZUIMap';

const groupEventsByLocation = (
  events: EventActivity[]
): LocationWithData<EventActivity>[] => {
  const locationsWithEvents = events.reduce(
    (
      acc: {
        [key: string]: LocationWithData<EventActivity>;
      },
      event
    ) => {
      const { location } = event.data;
      if (!location) {
        return acc;
      }
      // If no location yet
      if (!acc[location.id]) {
        return {
          ...acc,
          [location.id]: {
            ...location,
            data: [event],
          },
        };
      } else {
        return {
          ...acc,
          [location.id]: {
            ...acc[location.id],
            data: [...acc[location.id].data, event],
          },
        };
      }
    },
    {}
  );
  return Object.values(locationsWithEvents);
};

export default groupEventsByLocation;
