//TODO: Enable eslint rule and fix errors
/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { dehydrate } from 'react-query/hydration';
import { GetServerSideProps } from 'next';
import { Flex, Text } from '@adobe/react-spectrum';
import { QueryClient, useQuery } from 'react-query';

import EventList from '../../../components/EventList';
import getEvents from '../../../fetching/getEvents';
import getOrg from '../../../fetching/getOrg';
import { LayoutParams } from '../../../interfaces/LayoutParams';
import OrgLayout from '../../../components/layout/OrgLayout';

export const getServerSideProps : GetServerSideProps = async (context) => {
    const queryClient = new QueryClient();
    const { orgId } = context.params!;

    await queryClient.prefetchQuery('events', getEvents(orgId as string));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string));

    const eventsState = queryClient.getQueryState('events');
    const orgState = queryClient.getQueryState(['org', orgId]);

    if (eventsState!.status === 'success' && orgState!.status === 'success') {
        return {
            props: {
                dehydratedState: dehydrate(queryClient),
                orgId,
            },
        };
    }
    else {
        return {
            notFound: true,
        };
    }
};

type OrgEventsPageProps = {
    orgId: string;
};

export default function OrgEventsPage(props : OrgEventsPageProps) : JSX.Element {
    const { orgId } = props;
    const eventsQuery = useQuery('events', getEvents(orgId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <Flex marginY="size-500">
            { eventsQuery.data!.length > 0 ? (
                <EventList
                    events={ eventsQuery.data! }
                    org={ orgQuery.data! }
                />
            ) : (
                <Text data-test="no-events-placeholder">
                    Sorry, there are no planned events at the moment.
                </Text>
            ) }
        </Flex>
    );
}

OrgEventsPage.getLayout = function getLayout({ page, props } : LayoutParams) {

    return (
        <OrgLayout orgId={ props.orgId as string }>
            { page }
        </OrgLayout>
    );
};