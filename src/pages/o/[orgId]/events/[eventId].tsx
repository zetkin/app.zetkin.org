import { dehydrate } from 'react-query/hydration';
import { GetServerSideProps } from 'next';
import { QueryClient, useQuery } from 'react-query';

import DefaultOrgLayout from '../../../../components/layout/DefaultOrgLayout';
import EventDetails from '../../../../components/EventDetails';
import getEvent from '../../../../fetching/getEvent';
import getEventResponses from '../../../../fetching/getEventResponses';
import getOrg from '../../../../fetching/getOrg';
import { PageWithLayout } from '../../../../types';
import { scaffold } from '../../../../utils/next';
import { useEventResponses } from '../../../../hooks';
import { ZetkinEvent } from '../../../../interfaces/ZetkinEvent';
import { ZetkinOrganization } from '../../../../interfaces/ZetkinOrganization';

const scaffoldOptions = {
    localeScope: ['misc.publicHeader', 'pages.orgEvent'],
};

export const getServerSideProps: GetServerSideProps = scaffold(
    async (context) => {
        const queryClient = new QueryClient();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { orgId, eventId } = context.params!;
        const { user } = context;

        await queryClient.prefetchQuery(
            ['event', eventId],
            getEvent(orgId as string, eventId as string, context.apiFetch),
        );
        await queryClient.prefetchQuery(
            ['org', orgId],
            getOrg(orgId as string, context.apiFetch),
        );

        if (user) {
            await queryClient.prefetchQuery(
                'eventResponses',
                getEventResponses(context.apiFetch),
            );
        }
        else {
            null;
        }

        const eventState = queryClient.getQueryState(['event', eventId]);
        const orgState = queryClient.getQueryState(['org', orgId]);

        if (
            eventState?.status === 'success' &&
            orgState?.status === 'success'
        ) {
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
    },
    scaffoldOptions,
);

type OrgEventPageProps = {
    eventId: string;
    orgId: string;
};

const OrgEventPage: PageWithLayout<OrgEventPageProps> = (props) => {
    const { orgId, eventId } = props;
    const eventQuery = useQuery(['event', eventId], getEvent(orgId, eventId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));
    const { eventResponses, onEventResponse } = useEventResponses();

    if (!eventQuery.data) {
        return null;
    }

    const event = eventQuery.data as ZetkinEvent;
    const org = orgQuery.data as ZetkinOrganization;

    const response = eventResponses?.find(
        (response) => response.action_id === event.id,
    );

    return (
        <EventDetails
            event={ event }
            onEventResponse={ onEventResponse }
            org={ org }
            response={ response } 
        />
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
