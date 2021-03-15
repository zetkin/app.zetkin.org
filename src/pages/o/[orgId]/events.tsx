import { dehydrate } from 'react-query/hydration';
import { Flex } from '@adobe/react-spectrum';
import { GetServerSideProps } from 'next';
import { QueryClient, useQuery } from 'react-query';

import EventList from '../../../components/EventList';
import getEvents from '../../../fetching/getEvents';
import getOrg from '../../../fetching/getOrg';
import OrgLayout from '../../../components/layout/OrgLayout';
import { PageWithLayout } from '../../../types';
import { scaffold } from '../../../utils/next';

const scaffoldOptions = {
    localeScope: [
        'layout.org',
        'layout.orgHeader',
        'misc.eventList',
        'misc.publicHeader',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    const queryClient = new QueryClient();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId } = context.params!;

    await queryClient.prefetchQuery('events', getEvents(orgId as string));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string));

    const eventsState = queryClient.getQueryState('events');
    const orgState = queryClient.getQueryState(['org', orgId]);

    if (eventsState?.status === 'success' && orgState?.status === 'success') {
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
}, scaffoldOptions);

type OrgEventsPageProps = {
    orgId: string;
};

const OrgEventsPage : PageWithLayout<OrgEventsPageProps> = (props) => {
    const { orgId } = props;
    const eventsQuery = useQuery('events', getEvents(orgId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <Flex marginY="size-500">
            <EventList
                events={ eventsQuery.data }
                org={ orgQuery.data }
            />
        </Flex>
    );
};

OrgEventsPage.getLayout = function getLayout(page, props) {
    return (
        <OrgLayout orgId={ props.orgId as string }>
            { page }
        </OrgLayout>
    );
};

export default OrgEventsPage;