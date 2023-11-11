import { EventActivity } from 'features/campaigns/types';
import { ZetkinLocation } from 'utils/types/zetkin';

export interface LocationWithEvents {
  events: EventActivity[];
  location: ZetkinLocation;
}

const groupEventsByLocation = (
  events: EventActivity[]
): LocationWithEvents[] => {
  const locationsWithEvents = events.reduce(
    (
      acc: {
        [key: string]: LocationWithEvents;
      },
      event
    ) => {
      const { location } = event.data;
      if (!location) {
        return acc;
      }
      if (!acc[location.id]) {
        return {
          ...acc,
          [location.id]: {
            events: [event],
            location,
          },
        };
      } else {
        return {
          ...acc,
          [location.id]: {
            ...acc[location.id],
            events: [...acc[location.id].events, event],
          },
        };
      }
    },
    {}
  );
  return Object.values(locationsWithEvents);
};

export default groupEventsByLocation;
