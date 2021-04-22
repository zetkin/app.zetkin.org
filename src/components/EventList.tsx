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

import { ZetkinEvent } from '../interfaces/ZetkinEvent';
import { ZetkinEventResponse } from '../types/zetkin';
import { ZetkinOrganization } from '../interfaces/ZetkinOrganization';

interface EventListProps {
    events: ZetkinEvent[] | undefined;
    org: ZetkinOrganization;
    eventResponses: ZetkinEventResponse[] | undefined;
    onEventResponse: (eventId: number, orgId: number, response: boolean) => void;
}

export default function EventList ({ eventResponses, events, onEventResponse, org } : EventListProps) : JSX.Element {

    if (!events || events.length === 0) {
        return (
            <Text data-test="no-events-placeholder">
                <Msg id="misc.eventList.placeholder"/>
            </Text>
        );
    }

    return (
        <>
            <Flex data-test="event-list" direction="row" gap="100" wrap>
                { events?.map((event) => {
                    const response = eventResponses?.find(response => response.action_id === event.id);
                    return (<EventListItem
                        key={ event.id }
                        event={ event }
                        onEventResponse={ onEventResponse }
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
    event: ZetkinEvent;
    org: ZetkinOrganization;
    response: ZetkinEventResponse | undefined;
    onEventResponse: (eventId: number, orgId: number, response: boolean) => void;
}

const EventListItem = ({ event, response, onEventResponse, org }: EventListItemProps): JSX.Element => {

    return (
        <Flex data-test="event" direction="column" margin="size-200">
            <View data-test="event-title">
                { event.title ? event.title : event.activity.title }
            </View>
            <View data-test="org-title">{ org.title }</View>
            <View data-test="campaign-title">{ event.campaign.title }</View>
            <View data-test="start-time">
                <FormattedDate
                    day="2-digit"
                    month="long"
                    value={ Date.parse(event.start_time) }
                />
                , <FormattedTime
                    value={ Date.parse(event.start_time) }
                />
            </View>
            <View data-test="end-time">
                <FormattedDate
                    day="2-digit"
                    month="long"
                    value={ Date.parse(event.end_time) }
                />
                , <FormattedTime
                    value={ Date.parse(event.end_time) }
                />
            </View>
            <View data-test="location-title">{ event.location.title }</View>
            { response ? (
                <Button
                    data-test="event-response-button"
                    marginTop="size-50"
                    onPress={ () => onEventResponse(event.id, org.id, true) }
                    variant="cta">
                    <Msg id="misc.eventList.undoSignup" />
                </Button>
            ) : (
                <Button
                    data-test="event-response-button"
                    marginTop="size-50"
                    onPress={ () => onEventResponse(event.id, org.id, false) }
                    variant="cta">
                    <Msg id="misc.eventList.signup" />
                </Button>
            ) }
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
