import { GetServerSideProps } from 'next';
import { Heading } from '@adobe/react-spectrum';
import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';

import getEventResponses from '../../fetching/getEventResponses';
import getTodoEvents from '../../fetching/getTodoEvents';
import MyHomeLayout from '../../components/layout/MyHomeLayout';
import { PageWithLayout } from '../../types';
import { scaffold } from '../../utils/next';
import TodoList from '../../components/TodoList';
import { useEventResponses } from '../../hooks';

const scaffoldOptions = {
    localeScope: [
        'layout.my',
        'misc.eventListItem',
        'misc.publicHeader',
        'misc.todoList',
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

    return (
        <>
            <Heading level={ 1 }>
                <Msg id="pages.myTodo.heading"/>
            </Heading>
            <TodoList
                eventResponses={ eventResponses }
                onSignup={ onSignup }
                onUndoSignup={ onUndoSignup }
                todoEvents={ todoEventsQuery.data }
            />
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