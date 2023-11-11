import { FC } from 'react';
import { ZetkinEvent } from 'utils/types/zetkin';
import useEventsFromDateRange from 'features/events/hooks/useEventsFromDateRange';
import useCampaignEvents from 'features/campaigns/hooks/useCampaignEvents';

type EventListingProps = {
    orgId: number;  
    campId: number;
    data: ZetkinEvent;
}

const EventListing: FC<EventListingProps> = ({orgId, campId, data}) => { 
    const activitiesDateRange = useEventsFromDateRange(new Date(), new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)); // TODO: Smarter date handling. We dont just want to do next 60 days.
    console.log("Events with date range", activitiesDateRange)

    return <h1>{'Hello'}</h1>;
};

  export default EventListing;