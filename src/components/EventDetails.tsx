import Calendar from '@spectrum-icons/workflow/Calendar';
import Flag from '@spectrum-icons/workflow/Flag';
import Head from 'next/head';
import Location from '@spectrum-icons/workflow/Location';
import NextLink from 'next/link';
import { useContext } from 'react';
import {
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
} from 'react-intl';

import EventResponseButton from './EventResponseButton';
import Map from './maps/Map';
import SignupDialog from './SignupDialog';
import UserContext from '../contexts/UserContext';
import { ZetkinEvent } from '../types/zetkin';

interface EventDetailsProps {
    event: ZetkinEvent;
    onSignup: (eventId: number, orgId: number) => void;
    onUndoSignup: (eventId: number, orgId: number) => void;
}

const EventDetails = ({ event, onSignup, onUndoSignup } : EventDetailsProps) : JSX.Element => {
    const user = useContext(UserContext);

    return (
        <>
            <Head>
                <link crossOrigin="" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
                    rel="stylesheet"
                />
            </Head>
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
                        href={ `/o/${event.organization.id}` }>
                        <a data-testid="org-title">{ event.organization.title }</a>
                    </NextLink>
                </Link>
            </Header>
            <Flex marginBottom="size-100">
                <Flag marginEnd="size-100" size="S" />
                <Link>
                    <NextLink
                        href={ `/o/${event.organization.id}/campaigns/${event.campaign.id}` }>
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
            <Map height={ 500 } markers={ [event.location] }/>
            <Divider />
            <Text data-testid="info-text" marginY="size-300">
                { event.info_text }
            </Text>
            <View>
                { user ? (
                    <EventResponseButton
                        event={ event }
                        onSignup={ onSignup }
                        onUndoSignup={ onUndoSignup }
                    />
                ) : <SignupDialog /> }
            </View>
        </>
    );
};

export default EventDetails;
