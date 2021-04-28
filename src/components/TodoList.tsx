import {
    FormattedMessage as Msg,
} from 'react-intl';
import {
    Flex,
    Text,
} from '@adobe/react-spectrum';

import EventListItem from './EventListItem';
import {
    ZetkinEventResponse,
    ZetkinTodoEvent,
} from '../types/zetkin';

interface TodoListProps {
    todoEvents: ZetkinTodoEvent[] | undefined;
    eventResponses: ZetkinEventResponse[] | undefined;
    onSignup: (eventId: number, orgId: number) => void;
    onUndoSignup: (eventId: number, orgId: number) => void;
}

export default function TodoList ({ eventResponses, onSignup, onUndoSignup, todoEvents } : TodoListProps) : JSX.Element {

    if (!todoEvents || todoEvents.length === 0) {
        return (
            <Text data-testid="no-todoEvents-placeholder">
                <Msg id="misc.todoList.placeholder"/>
            </Text>
        );
    }

    return (
        <>
            <Flex data-testid="todo-list" direction="row" gap="100" wrap>
                { todoEvents?.map((todo) => {
                    const response = eventResponses?.find(response => response.action_id === todo.event.id);
                    return (
                        <>
                            { response ? (
                                <EventListItem
                                    key={ todo.event.id }
                                    activityTitle={ todo.event.activity.title }
                                    campaignTitle={ todo.event.campaign.title }
                                    endTime={ todo.event.end_time }
                                    eventId={ todo.event.id }
                                    location={ todo.event.location.title }
                                    onSignup={ onSignup }
                                    onUndoSignup={ onUndoSignup }
                                    orgId={ todo.org.id }
                                    orgTitle={ todo.org.title }
                                    response={ response }
                                    startTime={ todo.event.start_time }
                                    title={ todo.event.title }
                                />
                            ) : null }
                        </>
                    );
                }) }
            </Flex>
        </>
    );
}
