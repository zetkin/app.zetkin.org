import { Content } from '@adobe/react-spectrum';
import { FormattedMessage as Msg } from 'react-intl';
import { Item, Tabs } from '@react-spectrum/tabs';

import EventList from './EventList';
import { ZetkinEvent, ZetkinEventResponse } from '../types/zetkin';

interface EventTabsProps {
    bookedEvents: ZetkinEvent[] | undefined;
    eventResponses?: ZetkinEventResponse[] | undefined;
    onSignup?: (eventId: number, orgId: number) => void;
    onUndoSignup: (eventId: number, orgId: number) => void;
    timeRange: {
        later: ZetkinEvent[] | undefined;
        today: ZetkinEvent[] | undefined;
        tomorrow: ZetkinEvent[] | undefined;
        week: ZetkinEvent[] | undefined;
    };
}

const EventTabs = (
    {
        bookedEvents,
        eventResponses,
        onSignup,
        onUndoSignup,
        timeRange,
    } : EventTabsProps) : JSX.Element => {

    const { later, today, tomorrow, week } = timeRange;

    const tabItems = [];

    if (today && today.length > 0) {
        tabItems.push(
            <Item
                key="today"
                title={ <Msg id="misc.eventTabs.tabs.today"/> }>
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
                title={ <Msg id="misc.eventTabs.tabs.tomorrow"/> }>
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
                title={ <Msg id="misc.eventTabs.tabs.thisWeek"/> }>
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
                title={ <Msg id="misc.eventTabs.tabs.later"/> }>
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
        <Tabs
            aria-label="Options for events time filtering"
            data-testid="event-tabs"
            defaultSelectedKey="today">
            { tabItems }
        </Tabs>
    );
};

export default EventTabs;
