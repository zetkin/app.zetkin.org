import { FC } from 'react';
import { ZetkinEvent } from 'utils/types/zetkin';
import useEventsFromDateRange from 'features/events/hooks/useEventsFromDateRange';

type EventListingProps = {
    campId: number;
    orgId: number;  
    data: ZetkinEvent;
}

const EventListing: FC<EventListingProps> = ({campId, data}) => { 
    return <h1>{'Hello'}</h1>;
  };

const activities = useEventsFromDateRange(Date., lastDateToLoad);

  
  export default EventListing;
  