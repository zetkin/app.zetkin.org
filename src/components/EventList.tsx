interface EventListProps {
    events: { 
            campaign: { title: string },
            end_time: string,
            id: number,
            location: { title: string },
            start_time: string,
            title: string  
    }[],
    org: {
        id: number,
        title: string
    }
}

const EventList = ({ events, org } : EventListProps) : JSX.Element => {
    return (
        <>
            <ul data-test='event-list'>
                { events.map((e) => (
                    <li key={ e.id }>
                        { e.title }<br/>
                        { org.title }<br/>
                        { e.campaign.title }<br/>
                        { e.start_time }<br/>
                        { e.end_time }<br/>
                        { e.location.title }
                    </li>
                )) }
            </ul>
        </>
    );
};

export default EventList;