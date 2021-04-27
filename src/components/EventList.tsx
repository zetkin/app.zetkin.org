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
    ZetkinEvent,
    ZetkinEventResponse,
    ZetkinOrganization,
} from '../types/zetkin';

interface EventListProps {
    events: ZetkinEvent[] | undefined;
    onSignup: (eventId: number, orgId: number) => void;
    onUndoSignup: (eventId: number, orgId: number) => void;
    org?: ZetkinOrganization;
    eventResponses?: ZetkinEventResponse[];
}

export default function EventList ({ eventResponses, events, onSignup, onUndoSignup, org } : EventListProps) : JSX.Element {
    let todo : boolean;

    if (!org) {
        todo = true;
    }
    else {
        todo = false;
    }

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
                    return (<EventListItem
                        key={ event.id }
                        event={ event }
                        onSignup={ onSignup }
                        onUndoSignup={ onUndoSignup }
                        org={ org }
                        response={ response }
                        todo={ todo }
                    />
                    );
                })
                }
            </Flex>
        </>
    );

}

interface EventListItemProps {
    event: ZetkinEvent;
    onSignup: (eventId: number, orgId: number) => void;
    onUndoSignup: (eventId: number, orgId: number) => void;
    org?: ZetkinOrganization;
    response: ZetkinEventResponse | undefined;
    todo: boolean;
}

const EventListItem = ({ event, response, onSignup, onUndoSignup, org, todo }: EventListItemProps): JSX.Element => {

    if (org === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        org = event.organization!;
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
    event: ZetkinEvent;
    onSignup: (eventId: number, orgId: number) => void;
    onUndoSignup: (eventId: number, orgId: number) => void;
    org?: ZetkinOrganization;
    response: ZetkinEventResponse | undefined;
    todo: boolean;
}

const EventResponseButton = ({ event, onSignup, onUndoSignup, org, response, todo }: EventResponseButtonProps): JSX.Element => {

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
