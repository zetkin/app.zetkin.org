import { dehydrate } from 'react-query/hydration';
import { GetServerSideProps } from 'next';
import { FormattedMessage as Msg } from 'react-intl';
import NextLink from 'next/link';
import { Button, Flex, Heading, Link, Text } from '@adobe/react-spectrum';
import { QueryClient, useQuery } from 'react-query';

import getEvent from '../../../../fetching/getEvent';
import getOrg from '../../../../fetching/getOrg';
import { scaffold } from '../../../../utils/next';

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
});

type OrgEventPageProps = {
    eventId: string;
    orgId: string;
};

export default function OrgEventPage(props : OrgEventPageProps) : JSX.Element {
    const { orgId, eventId } = props;
    const eventQuery = useQuery(['event', eventId], getEvent(orgId, eventId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));
    const eventQueryData = eventQuery.data;

    return (
        <Flex direction="column">
            <Heading data-test="event-title" level={ 1 }>
                { eventQueryData?.title ? eventQueryData.title : eventQueryData?.activity.title }
            </Heading>
            <Flex>
                <Text marginEnd="size-50">
                    <Msg id="pages.o.orgId.events.eventId.list_title_org"/>:
                </Text>
                <Link>
                    <NextLink href={ `/o/${orgId}` }>
                        <a>{ orgQuery.data?.title }</a>
                    </NextLink>
                </Link>
            </Flex>
            <Flex>
                <Text marginEnd="size-50">
                    <Msg id="pages.o.orgId.events.eventId.list_title_campaign"/>:
                </Text>
                <Link>
                    <NextLink href={ `/o/${orgId}/campaigns/${eventQueryData?.campaign.id}` }>
                        <a>{ eventQueryData?.campaign.title }</a>
                    </NextLink>
                </Link>
            </Flex>
            <Flex>
                <Text marginEnd="size-50">
                    <Msg id="pages.o.orgId.events.eventId.list_title_start"/>:
                </Text>
                <Text data-test="start-time">
                    { eventQueryData?.start_time }
                </Text>
            </Flex>
            <Flex>
                <Text marginEnd="size-50">
                    <Msg id="pages.o.orgId.events.eventId.list_title_end"/>:
                </Text>
                <Text data-test="end-time">
                    { eventQueryData?.end_time }
                </Text>
            </Flex>
            <Flex>
                <Text marginEnd="size-50">
                    <Msg id="pages.o.orgId.events.eventId.list_title_info"/>:
                </Text>
                <Text data-test="info-text">
                    { eventQueryData?.info_text }
                </Text>
            </Flex>
            <Flex>
                <Text marginEnd="size-50">
                    <Msg id="pages.o.orgId.events.eventId.list_title_location"/>:
                </Text>
                <Text data-test="location">
                    { eventQueryData?.location.title }
                </Text>
            </Flex>
            <Button data-test="sign-up-button" marginY="size-200" variant="cta">
                <Msg id="pages.o.orgId.events.eventId.signup_button"/>
            </Button>
        </Flex>
    );
}