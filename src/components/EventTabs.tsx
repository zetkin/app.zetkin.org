import { FormattedMessage as Msg } from 'react-intl';
import {
    Content,
    Text,
} from '@adobe/react-spectrum';
import { Item, Tabs } from '@react-spectrum/tabs';

import EventList from './EventList';
import { ZetkinEvent, ZetkinEventResponse } from '../types/zetkin';

interface EventTabsProps {
    bookedEvents: ZetkinEvent[] | undefined;
    eventResponses?: ZetkinEventResponse[] | undefined;
    later: ZetkinEvent[] | undefined;
    onSignup?: (eventId: number, orgId: number) => void;
    onUndoSignup: (eventId: number, orgId: number) => void;
    today: ZetkinEvent[] | undefined;
    tomorrow: ZetkinEvent[] | undefined;
    week: ZetkinEvent[] | undefined;
}

const EventTabs = (
    {
        bookedEvents,
        eventResponses,
        later,
        onSignup,
        onUndoSignup,
        today,
        tomorrow,
        week,
    } : EventTabsProps) : JSX.Element => {

    const tabItems = [];

    if (today && today.length > 0) {
        tabItems.push(
            <Item
                key="today"
                title={ <Msg id="pages.my.tabs.today"/> }>
                <Content>
                    <EventList
                        bookedEvents={ bookedEvents }
                        eventResponses={ eventResponses }
                        events={ today }
                        onSignup={ onSignup }
                        onUndoSignup={ onUndoSignup }
                    />
                </Content>
            </Item>,
        );
    }

    if (tomorrow && tomorrow.length > 0) {
        tabItems.push(
            <Item
                key="tomorrow"
                title={ <Msg id="pages.my.tabs.tomorrow"/> }>
                <Content>
                    <EventList
                        bookedEvents={ bookedEvents }
                        eventResponses={ eventResponses }
                        events={ tomorrow }
                        onSignup={ onSignup }
                        onUndoSignup={ onUndoSignup }
                    />
                </Content>
            </Item>,
        );
    }

    if (week && week.length > 0) {
        tabItems.push(
            <Item
                key="week"
                title={ <Msg id="pages.my.tabs.thisWeek"/> }>
                <Content>
                    <EventList
                        bookedEvents={ bookedEvents }
                        eventResponses={ eventResponses }
                        events={ week }
                        onSignup={ onSignup }
                        onUndoSignup={ onUndoSignup }
                    />
                </Content>
            </Item>,
        );
    }

    if (later && later.length > 0) {
        tabItems.push(
            <Item
                key="later"
                title={ <Msg id="pages.my.tabs.later"/> }>
                <Content>
                    <EventList
                        bookedEvents={ bookedEvents }
                        eventResponses={ eventResponses }
                        events={ later }
                        onSignup={ onSignup }
                        onUndoSignup={ onUndoSignup }
                    />
                </Content>
            </Item>,
        );
    }

    return (
        <>
            { tabItems.length > 0 ? (
                <Tabs
                    aria-label="Options for events time filtering"
                    data-testid="event-tabs"
                    defaultSelectedKey="today">
                    { tabItems }
                </Tabs>
            ) : (
                <Text>
                    <Msg id="pages.my.placeholder"/>
                </Text>
            ) }
        </>
    );
};

export default EventTabs;
