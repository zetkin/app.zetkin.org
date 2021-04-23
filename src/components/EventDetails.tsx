import Calendar from '@spectrum-icons/workflow/Calendar';
import Flag from '@spectrum-icons/workflow/Flag';
import Location from '@spectrum-icons/workflow/Location';
import NextLink from 'next/link';
import {
    Button,
    Divider,
    Flex,
    Header,
    Heading,
    Image,
    Link,
    Text,
    View,
} from '@adobe/react-spectrum';
import {
    FormattedDate,
    FormattedTime,
    FormattedMessage as Msg,
} from 'react-intl';

import { ZetkinEvent } from '../types/zetkin';
import { ZetkinEventResponse } from '../types/zetkin';
import { ZetkinOrganization } from '../types/zetkin';

interface EventDetailsProps {
    event: ZetkinEvent;
    org: ZetkinOrganization;
    onSignup: (eventId: number, orgId: number) => void;
    onUndoSignup: (eventId: number, orgId: number) => void;
    response: ZetkinEventResponse | undefined;
}

const EventDetails = ({ event, org, onSignup, onUndoSignup, response } : EventDetailsProps) : JSX.Element => {
    return (
        <>
            <Header marginBottom="size-300">
                <Image
                    alt="Cover image"
                    height="size-2000"
                    objectFit="cover"
                    src="/cover.jpg"
                    width="100%"
                />
                <Heading
                    data-testid="event-title"
                    level={ 1 }
                    marginBottom="size-50">
                    { event.title ? event.title : event.activity.title }
                </Heading>
                <Link>
                    <NextLink
                        href={ `/o/${org.id}` }>
                        <a data-testid="org-title">{ org.title }</a>
                    </NextLink>
                </Link>
            </Header>
            <Flex marginBottom="size-100">
                <Flag marginEnd="size-100" size="S" />
                <Link>
                    <NextLink
                        href={ `/o/${org.id}/campaigns/${event.campaign.id}` }>
                        <a data-testid="campaign-title">{ event.campaign.title } </a>
                    </NextLink>
                </Link>
            </Flex>
            <Flex
                alignItems="center"
                data-testid="duration"
                marginBottom="size-100">
                <Calendar marginEnd="size-100" size="S" />
                <Flex direction="column">
                    <Text data-testid="event-dates">
                        <FormattedDate
                            day="2-digit"
                            month="long"
                            value={ Date.parse(event.start_time) }
                        />
                        –
                        <FormattedDate
                            day="2-digit"
                            month="long"
                            value={ Date.parse(event.end_time) }
                        />
                    </Text>
                    <Text data-testid="event-times">
                        <FormattedTime
                            value={ Date.parse(event.start_time) }
                        />
                        –
                        <FormattedTime
                            value={ Date.parse(event.end_time) }
                        />
                    </Text>
                </Flex>
            </Flex>
            <Flex marginBottom="size-300">
                <Location marginEnd="size-100" size="S" />
                <Text data-testid="location">{ event.location.title }</Text>
            </Flex>
            <Divider />
            <Text data-testid="info-text" marginY="size-300">
                { event.info_text }
            </Text>
            <View
                bottom="size-200"
                left="size-200"
                marginTop="size-200"
                position="absolute"
                right="size-200">
                { response ? (
                    <Button
                        data-testid="event-response-button"
                        onPress={ () => onUndoSignup(event.id, org.id) }
                        variant="cta"
                        width="100%">
                        <Msg id="pages.orgEvent.actions.undoSignup" />
                    </Button>
                ) : (
                    <Button
                        data-testid="event-response-button"
                        onPress={ () => onSignup(event.id, org.id) }
                        variant="cta"
                        width="100%">
                        <Msg id="pages.orgEvent.actions.signup" />
                    </Button>
                ) }
            </View>
        </>
    );
};

export default EventDetails;
