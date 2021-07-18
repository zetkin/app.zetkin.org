import { useIntl } from 'react-intl';
import { Card, Divider, List } from '@material-ui/core';

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
                { events.map((event, index) => (
                    <>
                        <EventListItem key={ event.id } event={ event } hrefBase={ hrefBase } />
                        {
                            // Show divider under all items except last
                            index !== events.length - 1 && (
                                <Divider />
                            )
                        }
                    </>
                )) }
            </List>
        </Card>
    );
};

export default EventList;
