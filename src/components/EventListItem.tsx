import NextLink from 'next/link';
import { ZetkinEventResponse } from '../types/zetkin';
import {
    Button,
    Flex,
    View,
} from '@adobe/react-spectrum';
import {
    FormattedDate,
    FormattedTime,
    FormattedMessage as Msg,
} from 'react-intl';

interface EventListItemProps {
    activityTitle: string;
    campaignTitle: string;
    endTime: string;
    eventId: number;
    location: string;
    onSignup: (eventId: number, orgId: number) => void;
    onUndoSignup: (eventId: number, orgId: number) => void;
    orgId: number;
    orgTitle: string;
    startTime: string;
    title: string | undefined;
    response: ZetkinEventResponse | undefined;
}

const EventListItem = (
    {
        activityTitle,
        campaignTitle,
        endTime,
        eventId,
        location,
        onSignup,
        onUndoSignup,
        orgId,
        orgTitle,
        response,
        startTime,
        title,
    }: EventListItemProps): JSX.Element => {

    return (
        <Flex data-testid="event" direction="column" margin="size-200">
            <View data-testid="event-title">
                { title ? title : activityTitle }
            </View>
            <View data-testid="org-title">{ orgTitle }</View>
            <View data-testid="campaign-title">{ campaignTitle }</View>
            <View data-testid="start-time">
                <FormattedDate
                    day="2-digit"
                    month="long"
                    value={ startTime }
                />
                , <FormattedTime
                    value={ Date.parse(startTime) }
                />
            </View>
            <View data-testid="end-time">
                <FormattedDate
                    day="2-digit"
                    month="long"
                    value={ Date.parse(endTime) }
                />
                , <FormattedTime
                    value={ Date.parse(endTime) }
                />
            </View>
            <View data-testid="location-title">{ location }</View>
            { response ? (
                <Button
                    data-testid="event-response-button"
                    marginTop="size-50"
                    onPress={ () => onUndoSignup(eventId, orgId) }
                    variant="cta">
                    <Msg id="misc.eventListItem.undoSignup" />
                </Button>
            ) : (
                <Button
                    data-testid="event-response-button"
                    marginTop="size-50"
                    onPress={ () => onSignup(eventId, orgId) }
                    variant="cta">
                    <Msg id="misc.eventListItem.signup" />
                </Button>
            ) }
            <NextLink href={ `/o/${orgId}/events/${ eventId }` }>
                <Button marginTop="size-50" variant="cta">
                    <Msg id="misc.eventListItem.moreInfo" />
                </Button>
            </NextLink>
        </Flex>
    );
};

export default EventListItem;