import { useIntl } from 'react-intl';
import { Card, List } from '@material-ui/core';

import EventListItem from './EventListItem';
import { ZetkinEvent } from '../../../types/zetkin';

interface EventListProps {
    hrefBase: string;
    events: ZetkinEvent[];
}

const EventList = ({ hrefBase, events }: EventListProps): JSX.Element => {
    const intl = useIntl();
    return (
        <Card>
            <List aria-label={ intl.formatMessage({
                id: 'pages.organizeCampaigns.events',
            }) }>
                { events.map(event => (
                    <EventListItem key={ event.id } event={ event } hrefBase={ hrefBase } />
                )) }
            </List>
        </Card>
    );
};

export default EventList;
