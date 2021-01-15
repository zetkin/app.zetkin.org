import { GetServerSideProps } from 'next';
import { dehydrate } from 'react-query/hydration';
import { QueryClient, useQuery } from 'react-query';

function getCampaignEvents(orgId, campId) {
    return async () => {
        const eventsRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/campaigns/${campId}/actions`);
        const eventsData = await eventsRes.json();
        return eventsData.data;
    };
}

function getCampaign(orgId, campId) {
    return async () => {
        const cIdRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/campaigns/${campId}`);
        const cIdData = await cIdRes.json();
        return cIdData.data;
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
    const { orgId, campId } = context.params;

    await queryClient.prefetchQuery(['campaignEvents', campId], getCampaignEvents(orgId, campId));
    await queryClient.prefetchQuery(['campaign', campId], getCampaign(orgId, campId));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId));

    const campaignEvents = queryClient.getQueryState(['campaignEvents', campId]);
    const campaignState = queryClient.getQueryState(['campaign', campId]);
    const orgState = queryClient.getQueryState(['org', orgId]);

    if (campaignEvents.status === 'success' && campaignState.status === 'success' && orgState.status === 'success') {
        return {
            props: {
                campId,
                dehydratedState: dehydrate(queryClient),
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

type OrgCampaignEventsPageProps = {
    campId: string,
    orgId: string,
}

export default function OrgCampaignEventsPage(props : OrgCampaignEventsPageProps) : JSX.Element {
    const { orgId, campId } = props;
    const campaignEventsQuery = useQuery(['campaignEvents', campId], getCampaignEvents(orgId, campId));
    const campaignQuery = useQuery(['campaign', campId], getCampaign(orgId, campId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <>
            <h1>{ orgQuery.data.title }</h1>
            <h1>{ campaignQuery.data.title }</h1>
            <ul>
                { campaignEventsQuery.data.map((e) => (
                    <li key={ e.id }>{ e.activity.title }</li>
                )) }
            </ul>
        </>
    );
}