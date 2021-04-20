import { dehydrate } from 'react-query/hydration';
import { Flex } from '@adobe/react-spectrum';
import { GetServerSideProps } from 'next';
import { QueryClient, useQuery } from 'react-query';

import EventList from '../../../components/EventList';
import getEventResponses from '../../../fetching/getEventResponses';
import getEvents from '../../../fetching/getEvents';
import getOrg from '../../../fetching/getOrg';
import MainOrgLayout from '../../../components/layout/MainOrgLayout';
import { PageWithLayout } from '../../../types';
import { scaffold } from '../../../utils/next';
import { useEventResponses } from '../../../hooks';

const scaffoldOptions = {
    localeScope: [
        'layout.org',
        'misc.eventList',
        'misc.publicHeader',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    const queryClient = new QueryClient();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId } = context.params!;
    const { user } = context;

    await queryClient.prefetchQuery('events', getEvents(orgId as string, context.apiFetch));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string, context.apiFetch));

    if (user) {
        await queryClient.prefetchQuery('eventResponses', getEventResponses(context.apiFetch));
    }

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

    const { eventResponses, onEventResponse } = useEventResponses();

    return (
        <Flex marginY="size-500">
            <EventList
                eventResponses={ eventResponses }
                events={ eventsQuery.data }
                onEventResponse={ onEventResponse }
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                org={ orgQuery.data! }
            />
        </Flex>
    );
};

OrgEventsPage.getLayout = function getLayout(page, props) {
    return (
        <MainOrgLayout orgId={ props.orgId as string }>
            { page }
        </MainOrgLayout>
    );
};

export default OrgEventsPage;