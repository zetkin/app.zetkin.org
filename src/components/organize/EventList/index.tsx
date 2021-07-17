import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Card, List } from '@material-ui/core';

import EventListItem from './EventListItem';
import getCampaignEvents from '../../../fetching/getCampaignEvents';

interface EventListProps {
    hrefBase: string;
}

const EventList = ({ hrefBase }: EventListProps): JSX.Element => {
    const intl = useIntl();
    const { campId, orgId } = useRouter().query;
    const { data: events } = useQuery(
        ['campaignEvents', orgId, campId],
        getCampaignEvents(orgId as string, campId as string),
    );

    return (
        <Card>
            <List aria-label={ intl.formatMessage({
                id: 'pages.organizeCampaigns.events',
            }) }>
                { events && events.map(event => (
                    <EventListItem key={ event.id } event={ event } hrefBase={ hrefBase } />
                )) }
            </List>
        </Card>
    );
};

export default EventList;
