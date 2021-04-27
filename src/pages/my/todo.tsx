import { GetServerSideProps } from 'next';
import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { Flex, Heading, Text } from '@adobe/react-spectrum';

import { EventListItem } from '../../components/EventList';
import getEventResponses from '../../fetching/getEventResponses';
import getTodoEvents from '../../fetching/getTodoEvents';
import MyHomeLayout from '../../components/layout/MyHomeLayout';
import { PageWithLayout } from '../../types';
import { scaffold } from '../../utils/next';
import { useEventResponses } from '../../hooks';

const scaffoldOptions = {
    localeScope: [
        'layout.my',
        'misc.eventList',
        'misc.publicHeader',
        'pages.myTodo',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    const { user } = context;

    await context.queryClient.prefetchQuery('todoEvents', getTodoEvents(context.apiFetch));

    const todoEventsState = context.queryClient.getQueryState('todoEvents');

    if (user) {
        await context.queryClient.prefetchQuery('eventResponses', getEventResponses(context.apiFetch));
    }

    if (todoEventsState?.status === 'success') {
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
    const todoEventsQuery = useQuery('todoEvents', getTodoEvents());

    const { eventResponses, onSignup, onUndoSignup } = useEventResponses();

    if (!todoEventsQuery.data || todoEventsQuery.data.length === 0) {
        return (
            <Text data-testid="no-events-placeholder">
                <Msg id="misc.eventList.placeholder"/>
            </Text>
        );
    }

    return (
        <>
            <Heading level={ 1 }>
                <Msg id="pages.myTodo.heading"/>
            </Heading>
            <Flex data-testid="event-list" direction="row" gap="100" wrap>
                { todoEventsQuery.data.map((todoEvent) => {
                    const response = eventResponses?.find(response => response.action_id === todoEvent.event.id);
                    return (
                        <EventListItem
                            key={ todoEvent.event.id }
                            event={ todoEvent.event }
                            onSignup={ onSignup }
                            onUndoSignup={ onUndoSignup }
                            org={ todoEvent.org }
                            response={ response }
                        />
                    );
                }) }
            </Flex>
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