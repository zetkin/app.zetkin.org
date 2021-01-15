import { GetServerSideProps } from 'next';
import { dehydrate } from 'react-query/hydration';
import { QueryClient, useQuery } from 'react-query';

function getEvent(orgId, eventId) {
    return async () => {
        const cRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/campaigns`);
        const cData = await cRes.json();

        for (const obj of cData.data) {
            const eventsRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/campaigns/${obj.id}/actions`);
            const campaignEvents = await eventsRes.json();
            const eventData = campaignEvents.data.find(event => event.id == eventId);
            if (eventData) {
                return eventData;
            }
        }

        throw 'not found';
    };
}

function getOrg(orgId) {
    return async () => {
        const oRes = await fetch(`http://localhost:3000/api/orgs/${orgId}`);
        const oData = await oRes.json();
        return oData.data;
    };
}

export const getServerSideProps : GetServerSideProps = async (context) => {
    const queryClient = new QueryClient();
    const { orgId, eventId } = context.params;

    await queryClient.prefetchQuery(['event', eventId], getEvent(orgId, eventId));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId));

    const eventState = queryClient.getQueryState(['event', eventId]);
    const orgState = queryClient.getQueryState(['org', orgId]);

    if (eventState.status === 'success' && orgState.status === 'success') {
        return {
            props: {
                dehydratedState: dehydrate(queryClient),
                eventId,
                orgId
            },
        };
    }
    else {
        return {
            notFound: true,
        };
    }
};

type OrgEventPageProps = {
    eventId: string,
    orgId: string,
}

export default function OrgEventPage(props : OrgEventPageProps) : JSX.Element {
    const { orgId, eventId } = props;
    const eventQuery = useQuery(['event', eventId], getEvent(orgId, eventId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <>
            <h1>{ orgQuery.data.title }</h1>
            <h1>{ eventQuery.data.title }</h1>
        </>
    );
}