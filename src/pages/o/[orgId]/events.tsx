import { Flex } from '@adobe/react-spectrum';
import { GetServerSideProps } from 'next';
import { useQuery } from 'react-query';

import EventList from '../../../components/EventList';
import getBookedEvents from '../../../fetching/getBookedEvents';
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
        'misc.signupDialog',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId } = context.params!;
    const { user } = context;

    await context.queryClient.prefetchQuery('events', getEvents(orgId as string, context.apiFetch));
    await context.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string, context.apiFetch));

    if (user) {
        await context.queryClient.prefetchQuery('eventResponses', getEventResponses(context.apiFetch));
        await context.queryClient.prefetchQuery('bookedEvents', getBookedEvents(context.apiFetch));
    }

    const eventsState = context.queryClient.getQueryState('events');
    const orgState = context.queryClient.getQueryState(['org', orgId]);

    if (eventsState?.status === 'success'
        && orgState?.status === 'success') {
        return {
            props: {
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

type EventsPageProps = {
    orgId: string;
};

const EventsPage : PageWithLayout<EventsPageProps> = (props) => {
    const { orgId } = props;
    const eventsQuery = useQuery('events', getEvents(orgId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));
    const bookedEventsQuery = useQuery('bookedEvents', getBookedEvents());

    const { eventResponses, onSignup, onUndoSignup } = useEventResponses();

    return (
        <Flex marginY="size-500">
            <EventList
                bookedEvents={ bookedEventsQuery.data }
                eventResponses={ eventResponses }
                events={ eventsQuery.data }
                onSignup={ onSignup }
                onUndoSignup={ onUndoSignup }
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                org={ orgQuery.data! }
            />
        </Flex>
    );
};

EventsPage.getLayout = function getLayout(page, props) {
    return (
        <MainOrgLayout orgId={ props.orgId as string }>
            { page }
        </MainOrgLayout>
    );
};

export default EventsPage;