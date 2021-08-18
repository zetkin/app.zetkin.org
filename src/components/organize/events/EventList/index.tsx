import React from 'react';
import { useRouter } from 'next/router';
import { Card, Divider, ListItem, ListItemText } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import { config as createEventAction } from 'components/ZetkinSpeedDial/actions/createEvent';
import { ZetkinEvent } from 'types/zetkin';
import ZetkinList from 'components/ZetkinList';

import EventListItem from './EventListItem';

interface EventListProps {
    hrefBase: string;
    events: ZetkinEvent[];
}

const EventList = ({ hrefBase, events }: EventListProps): JSX.Element => {
    const intl = useIntl();
    const router = useRouter();

    return (
        <Card>
            <ZetkinList
                aria-label={ intl.formatMessage({
                    id: 'pages.organizeCampaigns.events',
                }) }
                initialLength={ 5 }>
                { events.length === 0 ? (
                    <ListItem button component="a" onClick={ () => {
                        router.push(`${router.asPath}#${createEventAction.urlKey}`);
                    } }>
                        <ListItemText>
                            <Msg id="pages.organizeCampaigns.noEventsCreatePrompt" />
                        </ListItemText>
                    </ListItem>
                ) :
                    events.map((event, index) => (
                        <React.Fragment key={ index }>
                            <EventListItem key={ event.id } event={ event } hrefBase={ hrefBase } />
                            {
                            // Show divider under all items except last
                                index !== events.length - 1 && (
                                    <Divider />
                                )
                            }
                        </React.Fragment>
                    ))
                }
            </ZetkinList>
        </Card>
    );
};

export default EventList;
