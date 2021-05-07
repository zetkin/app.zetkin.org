import { GetServerSideProps } from 'next';
import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { Heading, Text, View } from '@adobe/react-spectrum';

import CallAssignmentList from '../../components/CallAssignmentList';
import EventList from '../../components/EventList';
import getBookedEvents from '../../fetching/getBookedEvents';
import getCallAssignments from '../../fetching/getCallAssignments';
import getRespondEvents from '../../fetching/getRespondEvents';
import MyHomeLayout from '../../components/layout/MyHomeLayout';
import { PageWithLayout } from '../../types';
import { scaffold } from '../../utils/next';
import { useEventResponses } from '../../hooks';

const scaffoldOptions = {
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

    let respondEventsState;
    let bookedEventsState;
    let callAssignmentsState;

    if (user) {
        await context.queryClient.prefetchQuery('respondEvents', getRespondEvents(context.apiFetch));
        await context.queryClient.prefetchQuery('bookedEvents', getBookedEvents(context.apiFetch));
        await context.queryClient.prefetchQuery('callAssignments', getCallAssignments(context.apiFetch));

        respondEventsState = context.queryClient.getQueryState('respondEvents');
        bookedEventsState = context.queryClient.getQueryState('bookedEvents');
        callAssignmentsState = context.queryClient.getQueryState('callAssignments');
    }

    if (respondEventsState?.status === 'success'
        && bookedEventsState?.status === 'success'
        && callAssignmentsState?.status === 'success') {

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
    const respondEventsQuery = useQuery('respondEvents', getRespondEvents());
    const bookedEventsQuery = useQuery('bookedEvents', getBookedEvents());
    const callAssignmentsQuery = useQuery('callAssignments', getCallAssignments());

    const { eventResponses, onSignup, onUndoSignup } = useEventResponses();

    if ((!respondEventsQuery.data || respondEventsQuery.data.length === 0)
        && (!callAssignmentsQuery.data || callAssignmentsQuery.data?.length === 0)) {
        return (
            <Text data-testid="no-events-placeholder">
                <Msg id="pages.myTodo.placeholder"/>
            </Text>
        );
    }

    if (!callAssignmentsQuery.data || callAssignmentsQuery.data?.length === 0) {
        return (
            <>
                <Heading level={ 1 }>
                    <Msg id="pages.myTodo.heading"/>
                </Heading>
                <View marginBottom="size-500">
                    <Heading level={ 2 } marginBottom="0">
                        <Msg id="pages.myTodo.events"/>
                    </Heading>
                    <EventList
                        bookedEvents={ bookedEventsQuery.data }
                        eventResponses={ eventResponses }
                        events={ respondEventsQuery.data }
                        onSignup={ onSignup }
                        onUndoSignup={ onUndoSignup }
                    />
                </View>
            </>
        );
    }

    return (
        <>
            <Heading level={ 1 }>
                <Msg id="pages.myTodo.heading"/>
            </Heading>
            <Heading level={ 2 } marginBottom="0">
                <Msg id="pages.myTodo.callAssignments"/>
            </Heading>
            <View marginBottom="0">
                <CallAssignmentList
                    callAssignments={ callAssignmentsQuery.data }
                />
            </View>
            <View marginBottom="size-500">
                <Heading level={ 2 } marginBottom="0">
                    <Msg id="pages.myTodo.events"/>
                </Heading>
                <EventList
                    bookedEvents={ bookedEventsQuery.data }
                    eventResponses={ eventResponses }
                    events={ respondEventsQuery.data }
                    onSignup={ onSignup }
                    onUndoSignup={ onUndoSignup }
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