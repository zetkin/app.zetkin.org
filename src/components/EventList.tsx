import Checkmark from '@spectrum-icons/workflow/Checkmark';
import NextLink from 'next/link';
import {
    Button,
    Flex,
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
    onSignup: (eventId: number, orgId: number) => void;
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
            <Flex data-testid="event-list" direction="row" gap="100" wrap>
                { events?.map((event) => {
                    const response = eventResponses?.find(response => response.action_id === event.id);
                    const booked = bookedEvents?.some(booked => booked.id === event.id);
                    let respondEvent;

                    if (event.respond) {
                        respondEvent = true;
                    }
                    else {
                        respondEvent = false;
                    }

                    return (<EventListItem
                        key={ event.id }
                        booked={ booked }
                        event={ event }
                        onSignup={ onSignup }
                        onUndoSignup={ onUndoSignup }
                        respondEvent={ respondEvent }
                        response={ response }
                    />
                    );
                })
                }
            </Flex>
        </>
    );

}

interface EventListItemProps {
    booked: boolean | undefined;
    event: ZetkinEvent;
    onSignup: (eventId: number, orgId: number) => void;
    onUndoSignup: (eventId: number, orgId: number) => void;
    respondEvent: boolean | undefined;
    response: ZetkinEventResponse | undefined;
}

const EventListItem = ({ booked, event, response, onSignup, onUndoSignup, respondEvent }: EventListItemProps): JSX.Element => {
    const user = useUser();

    if (respondEvent) {
        return (
            <>
                { response ? (
                    <Flex data-testid="event" direction="column" margin="size-200">
                        <View data-testid="event-title">
                            { event.title ? event.title : event.activity.title }
                        </View>
                        <View data-testid="org-title">{ event.organization.title }</View>
                        <View data-testid="campaign-title">{ event.campaign.title }</View>
                        <View data-testid="start-time">
                            <FormattedDate
                                day="2-digit"
                                month="long"
                                value={ Date.parse(event.start_time) }
                            />
                            , <FormattedTime
                                value={ Date.parse(event.start_time) }
                            />
                        </View>
                        <View data-testid="end-time">
                            <FormattedDate
                                day="2-digit"
                                month="long"
                                value={ Date.parse(event.end_time) }
                            />
                            , <FormattedTime
                                value={ Date.parse(event.end_time) }
                            />
                        </View>
                        <View data-testid="location-title">{ event.location.title }</View>
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
                                <Button marginTop="size-50" variant="cta">
                                    <Msg id="misc.eventList.moreInfo" />
                                </Button>
                            </a>
                        </NextLink>
                    </Flex>
                ) : null }
            </>
        );
    }

    return (
        <Flex data-testid="event" direction="column" margin="size-200">
            <View data-testid="event-title">
                { event.title ? event.title : event.activity.title }
            </View>
            <View data-testid="org-title">{ event.organization.title }</View>
            <View data-testid="campaign-title">{ event.campaign.title }</View>
            <View data-testid="start-time">
                <FormattedDate
                    day="2-digit"
                    month="long"
                    value={ Date.parse(event.start_time) }
                />
                , <FormattedTime
                    value={ Date.parse(event.start_time) }
                />
            </View>
            <View data-testid="end-time">
                <FormattedDate
                    day="2-digit"
                    month="long"
                    value={ Date.parse(event.end_time) }
                />
                , <FormattedTime
                    value={ Date.parse(event.end_time) }
                />
            </View>
            <View data-testid="location-title">{ event.location.title }</View>
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
                    <Button marginTop="size-50" variant="cta">
                        <Msg id="misc.eventList.moreInfo" />
                    </Button>
                </a>
            </NextLink>
        </Flex>
    );
};

interface EventResponseButtonProps {
    booked: boolean | undefined;
    event: ZetkinEvent;
    onSignup: (eventId: number, orgId: number) => void;
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

    return (
        <>
            { response ? (
                <Button
                    data-testid="event-response-button"
                    marginTop="size-50"
                    onPress={ () => onUndoSignup(event.id, event.organization.id) }
                    variant="cta">
                    <Msg id="misc.eventList.undoSignup" />
                </Button>
            ) : (
                <Button
                    data-testid="event-response-button"
                    marginTop="size-50"
                    onPress={ () => onSignup(event.id, event.organization.id) }
                    variant="cta">
                    <Msg id="misc.eventList.signup" />
                </Button>
            ) }
        </>
    );
};
