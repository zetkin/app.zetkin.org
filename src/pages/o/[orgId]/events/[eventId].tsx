import Calendar from '@spectrum-icons/workflow/Calendar';
import { dehydrate } from 'react-query/hydration';
import Flag from '@spectrum-icons/workflow/Flag';
import { GetServerSideProps } from 'next';
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
import { QueryClient, useQuery } from 'react-query';

import DefaultOrgLayout from '../../../../components/layout/DefaultOrgLayout';
import getEvent from '../../../../fetching/getEvent';
import getOrg from '../../../../fetching/getOrg';
import { PageWithLayout } from '../../../../types';
import { scaffold } from '../../../../utils/next';
import { useEventResponses } from '../../../../hooks';
import { ZetkinEvent } from '../../../../interfaces/ZetkinEvent';
import { ZetkinOrganization } from '../../../../interfaces/ZetkinOrganization';

const scaffoldOptions = {
    localeScope: [
        'misc.publicHeader',
        'pages.orgEvent',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    const queryClient = new QueryClient();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId, eventId } = context.params!;

    await queryClient.prefetchQuery(['event', eventId], getEvent(orgId as string, eventId as string));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string));

    const eventState = queryClient.getQueryState(['event', eventId]);
    const orgState = queryClient.getQueryState(['org', orgId]);

    if (eventState?.status === 'success' && orgState?.status === 'success') {
        return {
            props: {
                dehydratedState: dehydrate(queryClient),
                eventId,
                orgId,
            },
        };
    }
    else {
        return {
            notFound: true,
        };
    }
}, scaffoldOptions);

type OrgEventPageProps = {
    eventId: string;
    orgId: string;
};

const OrgEventPage : PageWithLayout<OrgEventPageProps> = (props) => {
    const { orgId, eventId } = props;
    const eventQuery = useQuery(['event', eventId], getEvent(orgId, eventId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));
    const { eventResponses, onEventResponse } = useEventResponses();

    if (!eventQuery.data) {
        return null;
    }

    const event = eventQuery.data as ZetkinEvent;
    const org = orgQuery.data as ZetkinOrganization;

    const response = eventResponses?.find(response => response.action_id === event.id);

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
                <Heading data-test="event-title" level={ 1 } marginBottom="size-50">
                    { event.title ? event.title : event.activity.title }
                </Heading>
                <Link>
                    <NextLink href={ `/o/${orgId}` }>
                        <a>{ org.title }</a>
                    </NextLink>
                </Link>
            </Header>
            <Flex marginBottom="size-100">
                <Flag marginEnd="size-100" size="S"/>
                <Link>
                    <NextLink href={ `/o/${orgId}/campaigns/${event.campaign.id}` }>
                        <a>{ event.campaign.title }</a>
                    </NextLink>
                </Link>
            </Flex>
            <Flex alignItems="center" data-test="duration" marginBottom="size-100">
                <Calendar marginEnd="size-100" size="S"/>
                <Flex direction="column">
                    <Text>
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
                    <Text>
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
                <Location marginEnd="size-100" size="S"/>
                <Text data-test="location">
                    { event.location.title }
                </Text>
            </Flex>
            <Divider />
            <Text data-test="info-text" marginY="size-300">
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
                        data-test="undo-sign-up-button"
                        onPress={ () => onEventResponse(event.id, org.id, true) }
                        variant="cta" width="100%">
                        <Msg id="pages.orgEvent.actions.undoSignup"/>
                    </Button>
                ) : (
                    <Button
                        data-test="sign-up-button"
                        onPress={ () => onEventResponse(event.id, org.id, false) }
                        variant="cta" width="100%">
                        <Msg id="pages.orgEvent.actions.signup"/>
                    </Button>
                ) }
            </View>
        </>
    );
};

OrgEventPage.getLayout = function getLayout(page, props) {
    return (
        <DefaultOrgLayout orgId={ props.orgId as string }>
            { page }
        </DefaultOrgLayout>
    );
};

export default OrgEventPage;