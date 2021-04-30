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

import {
    ZetkinBookedEvent,
    ZetkinEvent,
    ZetkinEventResponse,
    ZetkinOrganization,
} from '../types/zetkin';

interface EventListProps {
    bookedEvents: ZetkinBookedEvent[] | undefined;
    events: ZetkinEvent[] | undefined;
    onSignup: (eventId: number, orgId: number) => void;
    onUndoSignup: (eventId: number, orgId: number) => void;
    org?: ZetkinOrganization;
    eventResponses?: ZetkinEventResponse[];
}

export default function EventList ({ bookedEvents, eventResponses, events, onSignup, onUndoSignup, org } : EventListProps) : JSX.Element {

    if (!events || events.length === 0) {
        return (
            <Text data-testid="no-events-placeholder">
                <Msg id="misc.eventList.placeholder"/>
            </Text>
        );
    }

    return (
        <>
            <Flex data-testid="event-list" direction="row" gap="100" wrap>
                { events?.map((event) => {
                    const response = eventResponses?.find(response => response.action_id === event.id);
                    const booked = bookedEvents?.find(booked => booked.id === event.id);
                    return (<EventListItem
                        key={ event.id }
                        booked={ booked }
                        event={ event }
                        onSignup={ onSignup }
                        onUndoSignup={ onUndoSignup }
                        org={ org }
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
    booked: ZetkinBookedEvent | undefined;
    event: ZetkinEvent;
    onSignup: (eventId: number, orgId: number) => void;
    onUndoSignup: (eventId: number, orgId: number) => void;
    org?: ZetkinOrganization;
    response: ZetkinEventResponse | undefined;
}

const EventListItem = ({ booked, event, response, onSignup, onUndoSignup, org }: EventListItemProps): JSX.Element => {
    let todo : boolean;

    if (!org) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        org = event.organization!;
        todo = true;
    }
    else {
        todo = false;
    }

    return (
        <Flex data-testid="event" direction="column" margin="size-200">
            <View data-testid="event-title">
                { event.title ? event.title : event.activity.title }
            </View>
            <View data-testid="org-title">{ org.title }</View>
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
            <EventResponseButton
                booked={ booked }
                event={ event }
                onSignup={ onSignup }
                onUndoSignup={ onUndoSignup }
                org={ org }
                response={ response }
                todo={ todo }
            />
            <NextLink href={ `/o/${org.id}/events/${ event.id }` }>
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
    booked: ZetkinBookedEvent | undefined;
    event: ZetkinEvent;
    onSignup: (eventId: number, orgId: number) => void;
    onUndoSignup: (eventId: number, orgId: number) => void;
    org?: ZetkinOrganization;
    response: ZetkinEventResponse | undefined;
    todo: boolean;
}

const EventResponseButton = ({ booked, event, onSignup, onUndoSignup, org, response, todo }: EventResponseButtonProps): JSX.Element => {

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

    if (todo) {
        return (
            <Button
                data-testid="event-response-button"
                marginTop="size-50"
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                onPress={ () => onUndoSignup(event.id, org!.id) }
                variant="cta">
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
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    onPress={ () => onUndoSignup(event.id, org!.id) }
                    variant="cta">
                    <Msg id="misc.eventList.undoSignup" />
                </Button>
            ) : (
                <Button
                    data-testid="event-response-button"
                    marginTop="size-50"
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    onPress={ () => onSignup(event.id, org!.id) }
                    variant="cta">
                    <Msg id="misc.eventList.signup" />
                </Button>
            ) }
        </>
    );
};
