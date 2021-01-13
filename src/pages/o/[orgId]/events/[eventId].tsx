import { GetServerSideProps } from 'next';
import { dehydrate } from 'react-query/hydration';
import { QueryClient, useQuery } from 'react-query';

function getEvent(orgId, eventId) {
    return async () => {
        try {
            const cRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/campaigns`);
            const cData = await cRes.json();

            let allEventsData = [];

            for (const obj of cData.data) {
                const eventsRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/campaigns/${obj.id}/actions`);
                const campaignEvents = await eventsRes.json();
                allEventsData = allEventsData.concat(campaignEvents.data);
                const eventData = allEventsData.find(event => event.id == eventId);
                if (eventData) {
                    return eventData;
                }
            }
        }
        catch (err) {
            if (err.name != 'FetchError') {
                throw err;
            }
            return null;
        }
    };
}

function getOrg(orgId) {
    return async () => {
        try {
            const oRes = await fetch(`http://localhost:3000/api/orgs/${orgId}`);
            const oData = await oRes.json();

            return oData.data;
        }
        catch (err) {
            if (err.name != 'FetchError') {
                throw err;
            }
            return null;
        }
    };
}

export const getServerSideProps : GetServerSideProps = async (context) => {
    const queryClient = new QueryClient();
    const { orgId, eventId } = context.params;

    await queryClient.prefetchQuery('event', getEvent(orgId, eventId));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId));

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            eventId,
            orgId
        },
    };
};

type OrgEventPageProps = {
    eventId: string,
    orgId: string,
}

export default function OrgEventsPage(props : OrgEventPageProps) : JSX.Element {
    const { orgId, eventId } = props;
    const eventQuery = useQuery('event', getEvent(orgId, eventId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <>
            <h1>{ orgQuery.data.title }</h1>
            <h1>{ eventQuery.data.title }</h1>
        </>
    );
}