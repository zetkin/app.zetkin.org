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
    const activitiesDateRange = useEventsFromDateRange(new Date, new Date);
    const activites = useCampaignEvents(orgId, campId)

    console.log("Events with date range" + activitiesDateRange)
    console.log("Events" + activites)

    return <h1>{'Hello'}</h1>;
};

  export default EventListing;