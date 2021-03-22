import { dehydrate } from 'react-query/hydration';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { Button, Flex, Heading, Link, Text } from '@adobe/react-spectrum';
import {
    FormattedDate,
    FormattedTime,
    FormattedMessage as Msg,
} from 'react-intl';
import { QueryClient, useQuery } from 'react-query';

import getEvent from '../../../../fetching/getEvent';
import getOrg from '../../../../fetching/getOrg';
import { PageWithLayout } from '../../../../types';
import { scaffold } from '../../../../utils/next';
import SimpleOrgLayout from '../../../../components/layout/SimpleOrgLayout';
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

    if (!eventQuery.data) {
        return null;
    }

    const event = eventQuery.data as ZetkinEvent;
    const org = orgQuery.data as ZetkinOrganization;

    return (
        <Flex direction="column">
            <Heading data-test="event-title" level={ 1 }>
                { event.title ? event.title : event.activity.title }
            </Heading>
            <Flex>
                <Text marginEnd="size-50">
                    <Msg id="pages.orgEvent.details.org"/>:
                </Text>
                <Link>
                    <NextLink href={ `/o/${orgId}` }>
                        <a>{ org.title }</a>
                    </NextLink>
                </Link>
            </Flex>
            <Flex>
                <Text marginEnd="size-50">
                    <Msg id="pages.orgEvent.details.campaign"/>:
                </Text>
                <Link>
                    <NextLink href={ `/o/${orgId}/campaigns/${event.campaign.id}` }>
                        <a>{ event.campaign.title }</a>
                    </NextLink>
                </Link>
            </Flex>
            <Flex>
                <Text marginEnd="size-50">
                    <Msg id="pages.orgEvent.details.start"/>:
                </Text>
                <Text data-test="start-time">
                    <FormattedDate
                        day="2-digit"
                        month="long"
                        value={ Date.parse(event.start_time) }
                    />
                    , <FormattedTime
                        value={ Date.parse(event.start_time) }
                    />
                </Text>
            </Flex>
            <Flex>
                <Text marginEnd="size-50">
                    <Msg id="pages.orgEvent.details.end"/>:
                </Text>
                <Text data-test="end-time">
                    <FormattedDate
                        day="2-digit"
                        month="long"
                        value={ Date.parse(event.end_time) }
                    />
                    , <FormattedTime
                        value={ Date.parse(event.end_time) }
                    />
                </Text>
            </Flex>
            <Flex>
                <Text marginEnd="size-50">
                    <Msg id="pages.orgEvent.details.info"/>:
                </Text>
                <Text data-test="info-text">
                    { event.info_text }
                </Text>
            </Flex>
            <Flex>
                <Text marginEnd="size-50">
                    <Msg id="pages.orgEvent.details.location"/>:
                </Text>
                <Text data-test="location">
                    { event.location.title }
                </Text>
            </Flex>
            <Button data-test="sign-up-button" marginY="size-200" variant="cta">
                <Msg id="pages.orgEvent.actions.signUp"/>
            </Button>
        </Flex>
    );
};

OrgEventPage.getLayout = function getLayout(page, props) {
    return (
        <SimpleOrgLayout orgId={ props.orgId as string }>
            { page }
        </SimpleOrgLayout>
    );
};

export default OrgEventPage;