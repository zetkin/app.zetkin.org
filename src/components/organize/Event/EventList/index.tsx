import { List } from '@material-ui/core';
import { useIntl } from 'react-intl';

import EventListItem from './EventListItem';
import { ZetkinEvent } from '../../../../types/zetkin';

interface EventListProps {
    events: ZetkinEvent[];
    hrefBase: string;
}

const EventList = ({ events, hrefBase }: EventListProps): JSX.Element => {
    const intl = useIntl();

    return (
        <List aria-label={ intl.formatMessage({
            id: 'pages.organizeCampaigns.events',
        }) } disablePadding>
            { events.map(event => (
                <EventListItem key={ event.id } event={ event } hrefBase={ hrefBase } />
            )) }
        </List>
    );
};

export default EventList;
