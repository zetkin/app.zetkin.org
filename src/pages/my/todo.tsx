import { GetServerSideProps } from 'next';
import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { Content, Heading, Text, View } from '@adobe/react-spectrum';
import { Item, Tabs } from '@react-spectrum/tabs';

import CallAssignmentList from '../../components/CallAssignmentList';
import EventList from '../../components/EventList';
import getBookedEvents from '../../fetching/getBookedEvents';
import getCallAssignments from '../../fetching/getCallAssignments';
import getRespondEvents from '../../fetching/getRespondEvents';
import MyHomeLayout from '../../components/layout/MyHomeLayout';
import { PageWithLayout } from '../../types';
import { scaffold } from '../../utils/next';
import { useEventsFilter, useRespondEvents } from '../../hooks';

const scaffoldOptions = {
    authLevelRequired: 1,
    localeScope: [
        'layout.my',
        'misc.callAssignmentList',
        'misc.eventList',
        'misc.publicHeader',
        'pages.myTodo',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    const { user } = context;

    if (user) {
        await context.queryClient.prefetchQuery('respondEvents', getRespondEvents(context.apiFetch));
        await context.queryClient.prefetchQuery('bookedEvents', getBookedEvents(context.apiFetch));
        await context.queryClient.prefetchQuery('callAssignments', getCallAssignments(context.apiFetch));

        return {
            props: {},
        };
    }
    else {
        return {
            notFound: true,
        };
    }
}, scaffoldOptions);

const MyTodoPage : PageWithLayout = () => {
    const bookedEventsQuery = useQuery('bookedEvents', getBookedEvents());
    const callAssignmentsQuery = useQuery('callAssignments', getCallAssignments());

    const { respondEvents, onUndoSignup } = useRespondEvents();
    const { today, tomorrow, week, later } = useEventsFilter(respondEvents);

    if ((!respondEvents || respondEvents.length === 0)
        && (!callAssignmentsQuery.data || callAssignmentsQuery.data?.length === 0)) {
        return (
            <>
                <Heading level={ 1 }>
                    <Msg id="pages.myTodo.heading"/>
                </Heading>
                <Text data-testid="no-events-placeholder">
                    <Msg id="pages.myTodo.placeholder"/>
                </Text>
            </>
        );
    }

    const tabItems = [];

    if (today && today.length > 0) {
        tabItems.push(
            <Item
                key="today"
                title={ <Msg id="pages.myTodo.tabs.today"/> }>
                <Content>
                    <EventList
                        bookedEvents={ bookedEventsQuery.data }
                        events={ today }
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
                title={ <Msg id="pages.myTodo.tabs.tomorrow"/> }>
                <Content>
                    <EventList
                        bookedEvents={ bookedEventsQuery.data }
                        events={ tomorrow }
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
                title={ <Msg id="pages.myTodo.tabs.thisWeek"/> }>
                <Content>
                    <EventList
                        bookedEvents={ bookedEventsQuery.data }
                        events={ week }
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
                title={ <Msg id="pages.myTodo.tabs.later"/> }>
                <Content>
                    <EventList
                        bookedEvents={ bookedEventsQuery.data }
                        events={ later }
                        onUndoSignup={ onUndoSignup }
                    />
                </Content>
            </Item>,
        );
    }

    return (
        <>
            <Heading level={ 1 }>
                <Msg id="pages.myTodo.heading"/>
            </Heading>
            { !callAssignmentsQuery.data || callAssignmentsQuery.data?.length === 0
                ? null
                : (
                    <>
                        <Heading level={ 2 } marginBottom="0">
                            <Msg id="pages.myTodo.callAssignments"/>
                        </Heading>
                        <View marginBottom="0">
                            <CallAssignmentList
                                callAssignments={ callAssignmentsQuery.data }
                            />
                        </View>
                    </>
                )
            }
            <View marginBottom="size-500">
                <Heading level={ 2 } marginBottom="0">
                    <Msg id="pages.myTodo.events"/>
                </Heading>
                { tabItems.length !== 0 ? (
                    <Tabs
                        aria-label="Options for events time filtering"
                        data-testid="event-tabs"
                        defaultSelectedKey="today">
                        { tabItems }
                    </Tabs>
                ) : (
                    <Text>
                        <Msg id="pages.myTodo.eventsPlaceholder"/>
                    </Text>
                ) }
            </View>
        </>
    );
};

MyTodoPage.getLayout = function getLayout(page) {
    return (
        <MyHomeLayout>
            { page }
        </MyHomeLayout>
    );
};

export default MyTodoPage;