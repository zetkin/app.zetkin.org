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
    onSignup: (eventId: number, orgId: number) => void;
    onUndoSignup: (eventId: number, orgId: number) => void;
}

const EventList = ({ eventResponses, events, onSignup, onUndoSignup, org } : EventListProps) : JSX.Element => {

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
                { events?.map((e) => {
                    const response = eventResponses?.find(response => response.action_id === e.id);
                    return (
                        <Flex key={ e.id } data-test="event" direction="column" margin="size-200">
                            <View data-test="event-title">
                                { e.title ? e.title : e.activity.title }
                            </View>
                            <View data-test="org-title">{ org.title }</View>
                            <View data-test="campaign-title">{ e.campaign.title }</View>
                            <View data-test="start-time">
                                <FormattedDate
                                    day="2-digit"
                                    month="long"
                                    value={ Date.parse(e.start_time) }
                                />
                                , <FormattedTime
                                    value={ Date.parse(e.start_time) }
                                />
                            </View>
                            <View data-test="end-time">
                                <FormattedDate
                                    day="2-digit"
                                    month="long"
                                    value={ Date.parse(e.end_time) }
                                />
                                , <FormattedTime
                                    value={ Date.parse(e.end_time) }
                                />
                            </View>
                            <View data-test="location-title">{ e.location.title }</View>
                            { response ? (
                                <Button
                                    data-test="event-response-button"
                                    marginTop="size-50"
                                    onPress={ () => onUndoSignup(e.id, org.id) }
                                    variant="cta">
                                    <Msg id="misc.eventList.undoSignup"/>
                                </Button>
                            ) : (
                                <Button
                                    data-test="event-response-button"
                                    marginTop="size-50"
                                    onPress={ () => onSignup(e.id, org.id) }
                                    variant="cta">
                                    <Msg id="misc.eventList.signup"/>
                                </Button>
                            ) }
                            <NextLink href={ `/o/${org.id}/events/${e.id}` }>
                                <a>
                                    <Button marginTop="size-50" variant="cta">
                                        <Msg id="misc.eventList.moreInfo"/>
                                    </Button>
                                </a>
                            </NextLink>
                        </Flex>
                    );
                }) }
            </Flex>
        </>
    );
};

export default EventList;