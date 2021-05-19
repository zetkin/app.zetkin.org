import Checkmark from '@spectrum-icons/workflow/Checkmark';
import NextLink from 'next/link';
import {
    Button,
    Divider,
    Flex,
    Heading,
    Text,
    View,
} from '@adobe/react-spectrum';
import {
    FormattedDate,
    FormattedTime,
    FormattedMessage as Msg,
} from 'react-intl';

import SignupDialogTrigger from './SignupDialog';
import { useUser } from '../hooks';
import {
    ZetkinEvent,
    ZetkinEventResponse,
} from '../types/zetkin';

interface EventListProps {
    bookedEvents: ZetkinEvent[] | undefined;
    events: ZetkinEvent[] | undefined;
    onSignup?: (eventId: number, orgId: number) => void;
    onUndoSignup: (eventId: number, orgId: number) => void;
    eventResponses?: ZetkinEventResponse[];
}

export default function EventList ({ bookedEvents, eventResponses, events, onSignup, onUndoSignup } : EventListProps) : JSX.Element {

    if (!events || events.length === 0) {
        return (
            <>
                <Text data-testid="no-events-placeholder">
                    <Msg id="misc.eventList.placeholder" />
                </Text>
            </>
        );
    }

    return (
        <>
            <Flex
                data-testid="event-list"
                direction="column"
                gap="100"
                marginBottom="size-200"
                width="100%">
                { events?.map((event) => {
                    const response = eventResponses?.find(response => response.action_id === event.id);
                    const booked = bookedEvents?.some(booked => booked.id === event.id);

                    return (<EventListItem
                        key={ event.id }
                        booked={ booked }
                        event={ event }
                        onSignup={ onSignup }
                        onUndoSignup={ onUndoSignup }
                        response={ response }
                    />
                    );
                }) }
            </Flex>
        </>
    );
}

interface EventListItemProps {
    booked: boolean | undefined;
    event: ZetkinEvent;
    onSignup?: (eventId: number, orgId: number) => void;
    onUndoSignup: (eventId: number, orgId: number) => void;
    response: ZetkinEventResponse | undefined;
}

const EventListItem = ({ booked, event, response, onSignup, onUndoSignup }: EventListItemProps): JSX.Element => {
    const user = useUser();

    return (
        <>
            <Flex
                alignItems="center"
                data-testid="event"
                direction="row"
                justifyContent="space-between"
                marginY="size-200"
                wrap>
                <View width="60%">
                    <Heading data-testid="event-title" level={ 3 } marginBottom="0">
                        { event.title ? event.title : event.activity.title }
                    </Heading>
                    <Heading data-testid="org-title" level={ 5 } marginY="size-100">{ event.organization.title }</Heading>
                    <Heading data-testid="start-time" level={ 5 } marginTop="0">
                        <FormattedDate
                            day="2-digit"
                            month="long"
                            value={ Date.parse(event.start_time) }
                        />
                        , <FormattedTime
                            value={ Date.parse(event.start_time) }
                        />
                    </Heading>
                </View>
                <Flex direction="column" width="size-2000">
                    { user ? (
                        <EventResponseButton
                            booked={ booked }
                            event={ event }
                            onSignup={ onSignup }
                            onUndoSignup={ onUndoSignup }
                            response={ response }
                        />
                    ) : <SignupDialogTrigger /> }
                    <NextLink href={ `/o/${event.organization.id}/events/${ event.id }` }>
                        <a>
                            <Button marginTop="size-50" variant="primary" width="100%">
                                <Msg id="misc.eventList.moreInfo" />
                            </Button>
                        </a>
                    </NextLink>
                </Flex>
            </Flex>
            <Divider size="S" />
        </>
    );
};

interface EventResponseButtonProps {
    booked: boolean | undefined;
    event: ZetkinEvent;
    onSignup?: (eventId: number, orgId: number) => void;
    onUndoSignup: (eventId: number, orgId: number) => void;
    response: ZetkinEventResponse | undefined;
}

const EventResponseButton = ({ booked, event, onSignup, onUndoSignup, response } : EventResponseButtonProps): JSX.Element => {

    if (booked) {
        return (
            <Flex
                alignItems="center"
                data-testid="booked"
                marginTop="3px"
                minHeight="32px">
                <Checkmark aria-label="Inbokad" color="positive" />
                <Msg id="misc.eventList.booked" />
            </Flex>
        );
    }

    //TODO: Remove when getRespondEvents and eventResponses has been refactored.
    if (!onSignup) {
        return (
            <Button
                data-testid="event-response-button"
                marginTop="size-50"
                onPress={ () => onUndoSignup(event.id, event.organization.id) }
                variant="negative">
                <Msg id="misc.eventList.undoSignup" />
            </Button>
        );
    }

    return (
        <>
            { response ? (
                <Button
                    data-testid="event-response-button"
                    marginTop="size-50"
                    onPress={ () => onUndoSignup(event.id, event.organization.id) }
                    variant="negative"
                    width="100%">
                    <Msg id="misc.eventList.undoSignup" />
                </Button>
            ) : (
                <Button
                    data-testid="event-response-button"
                    marginTop="size-50"
                    onPress={ () => onSignup(event.id, event.organization.id) }
                    variant="primary"
                    width="100%">
                    <Msg id="misc.eventList.signup" />
                </Button>
            ) }
        </>
    );
};
