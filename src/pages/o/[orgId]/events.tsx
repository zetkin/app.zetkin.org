import { GetServerSideProps } from 'next';
import { dehydrate } from 'react-query/hydration';
import { QueryClient, useQuery } from 'react-query';

function getEvents(orgId) {
    return async () => {
        try {
            const cRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/campaigns`);
            const cData = await cRes.json();

            let allEventsData = [];

            for (const obj of cData.data) {
                const eventsRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/campaigns/${obj.id}/actions`);
                const campaignEvents = await eventsRes.json();
                allEventsData = allEventsData.concat(campaignEvents.data);
            }

            return allEventsData;
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
    const { orgId } = context.params;

    await queryClient.prefetchQuery('events', getEvents(orgId));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId));

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            orgId
        },
    };
};

type OrgEventsPageProps = {
    orgId: string,
}

export default function OrgEventsPage(props : OrgEventsPageProps) : JSX.Element {
    const { orgId } = props;
    const eventsQuery = useQuery('events', getEvents(orgId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <>
            <h1>Events for { orgQuery.data.title }</h1>
            <ul>
                { eventsQuery.data.map((e) => (
                    <li key={ e.id }>{ e.title }</li>
                )) }
            </ul>
        </>
    );
}