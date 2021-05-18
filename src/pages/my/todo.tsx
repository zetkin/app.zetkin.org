import { GetServerSideProps } from 'next';
import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { Heading, Text, View } from '@adobe/react-spectrum';

import CallAssignmentList from '../../components/CallAssignmentList';
import EventTabs from '../../components/EventTabs';
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
        'misc.eventTabs',
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
                <EventTabs
                    bookedEvents={ bookedEventsQuery.data }
                    later={ later }
                    onUndoSignup={ onUndoSignup }
                    today={ today }
                    tomorrow={ tomorrow }
                    week={ week }
                />
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