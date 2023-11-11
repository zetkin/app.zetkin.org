import { FC } from 'react';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIFuture from 'zui/ZUIFuture';
import useEventsFromDateRange from 'features/events/hooks/useEventsFromDateRange';

type EventListingProps = {
    orgId: number;  
    campId: number;
}

const EventListing: FC<EventListingProps> = ({orgId, campId}) => { 
    const eventsFromDateRange = useEventsFromDateRange(new Date(), new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)); // TODO: Smarter date handling. We dont just want to do next 60 days.

    return (
        <>
            <p>{'Hello hehe'}</p>
            <ZUIFuture future={eventsFromDateRange}>
                {(data) => {
                    <p>{data}</p> // Not working
                }}
            </ZUIFuture>
        </>
    )
};

export default EventListing;