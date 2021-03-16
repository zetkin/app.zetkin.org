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
import { scaffold } from '../../../../utils/next';

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

export default function OrgEventPage(props : OrgEventPageProps) : JSX.Element {
    const { orgId, eventId } = props;
    const eventQuery = useQuery(['event', eventId], getEvent(orgId, eventId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));
    const eventQueryData = eventQuery.data;

    return (
        //TODO: Break out eventinfo-component and test placeholder text when missing info?
        <Flex direction="column">
            <Heading data-test="event-title" level={ 1 }>
                { eventQueryData?.title ? eventQueryData.title : eventQueryData?.activity.title }
            </Heading>
            <Flex>
                <Text marginEnd="size-50">
                    <Msg id="pages.orgEvent.details.org"/>:
                </Text>
                <Link>
                    <NextLink href={ `/o/${orgId}` }>
                        <a>{ orgQuery.data?.title }</a>
                    </NextLink>
                </Link>
            </Flex>
            <Flex>
                <Text marginEnd="size-50">
                    <Msg id="pages.orgEvent.details.campaign"/>:
                </Text>
                <Link>
                    <NextLink href={ `/o/${orgId}/campaigns/${eventQueryData?.campaign.id}` }>
                        <a>{ eventQueryData?.campaign.title }</a>
                    </NextLink>
                </Link>
            </Flex>
            <Flex>
                <Text marginEnd="size-50">
                    <Msg id="pages.orgEvent.details.start"/>:
                </Text>
                { eventQueryData ? (
                    <Text data-test="start-time">
                        <FormattedDate
                            day="2-digit"
                            month="long"
                            value={ Date.parse(eventQueryData.start_time) }
                        />
                        , <FormattedTime
                            value={ Date.parse(eventQueryData.start_time) }
                        />
                    </Text>
                ) : <Msg id="pages.orgEvent.details.org"/> }
            </Flex>
            <Flex>
                <Text marginEnd="size-50">
                    <Msg id="pages.orgEvent.details.end"/>:
                </Text>
                { eventQueryData ? (
                    <Text data-test="end-time">
                        <FormattedDate
                            day="2-digit"
                            month="long"
                            value={ Date.parse(eventQueryData.end_time) }
                        />
                        , <FormattedTime
                            value={ Date.parse(eventQueryData.end_time) }
                        />
                    </Text>
                ) : <Msg id="pages.orgEvent.details.org"/> }
            </Flex>
            <Flex>
                <Text marginEnd="size-50">
                    <Msg id="pages.orgEvent.details.info"/>:
                </Text>
                <Text data-test="info-text">
                    { eventQueryData?.info_text }
                </Text>
            </Flex>
            <Flex>
                <Text marginEnd="size-50">
                    <Msg id="pages.orgEvent.details.location"/>:
                </Text>
                <Text data-test="location">
                    { eventQueryData?.location.title }
                </Text>
            </Flex>
            <Button data-test="sign-up-button" marginY="size-200" variant="cta">
                <Msg id="pages.orgEvent.signUpButton"/>
            </Button>
        </Flex>
    );
}