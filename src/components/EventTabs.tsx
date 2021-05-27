import { Content } from '@adobe/react-spectrum';
import { FormattedMessage as Msg } from 'react-intl';
import { Item, Tabs } from '@react-spectrum/tabs';

import EventList from './EventList';
import { ZetkinEvent } from '../types/zetkin';

interface EventTabsProps {
    events: ZetkinEvent[] | undefined;
    onSignup?: (eventId: number, orgId: number) => void;
    onUndoSignup: (eventId: number, orgId: number) => void;
}

const EventTabs = (
    {
        events,
        onSignup,
        onUndoSignup,
    } : EventTabsProps) : JSX.Element => {

    function extractISODate(string : string) {
        return string.slice(0, 10);
    }

    function createDateString(increment? : number) {
        const today = new Date();

        if (increment) {
            today.setDate(today.getDate() + increment);
        }

        const date = extractISODate(today.toISOString());
        return date;
    }

    const today = events?.filter(event =>
        extractISODate(event.start_time) === createDateString());

    const tomorrow = events?.filter(event =>
        extractISODate(event.start_time) === createDateString(1));

    const week = events?.filter(event =>
        extractISODate(event.start_time) <= createDateString(7)
        && extractISODate(event.start_time) >= createDateString());

    const later = events?.filter(event =>
        extractISODate(event.start_time) > createDateString(7));

    const tabItems = [];

    if (today && today.length > 0) {
        tabItems.push(
            <Item
                key="today"
                title={ <Msg id="misc.eventTabs.tabs.today"/> }>
                <Content>
                    <EventList
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
