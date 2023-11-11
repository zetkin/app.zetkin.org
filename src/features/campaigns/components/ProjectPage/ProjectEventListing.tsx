import { FC } from 'react';
import useEventsFromDateRange from 'features/events/hooks/useEventsFromDateRange';
//import OverviewListItem from 'features/campaigns/components/ActivitiesOverview/items/OverviewListItem'

type EventListingProps = {
    orgId: number;  
    campId: number;
}

const EventListing: FC<EventListingProps> = ({orgId, campId}) => { 
    const eventsFromDateRange = useEventsFromDateRange(new Date(), new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)); // TODO: Smarter date handling. We dont just want to do next 60 days.
    console.log("Events with date range", eventsFromDateRange)

    return (
        //<OverviewListItem {title=''}></OverviewListItem>
        <h1>{eventsFromDateRange[0].data.title}</h1>
    )
};

export default EventListing;