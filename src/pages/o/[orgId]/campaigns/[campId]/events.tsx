import { GetServerSideProps } from 'next';
import { dehydrate } from 'react-query/hydration';
import { QueryClient, useQuery } from 'react-query';

function getCampaignEvents(orgId, campId) {
    return async () => {
        try {
            const eventsRes = await fetch(`http://api.zetk.in/v1/orgs/${orgId}/campaigns/${campId}/actions`);
            const eventsData = await eventsRes.json();

            return eventsData.data;
        }
        catch (err) {
            if (err.name != 'FetchError') {
                throw err;
            }
            return null;
        }
    };
}

function getCampaign(orgId, campId) {
    return async () => {
        try {
            const cIdRes = await fetch(`http://api.zetk.in/v1/orgs/${orgId}/campaigns/${campId}`);
            const cIdData = await cIdRes.json();

            return cIdData.data;
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
            const oRes = await fetch(`http://api.zetk.in/v1/orgs/${orgId}`);
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
    const { orgId, campId } = context.params;

    await queryClient.prefetchQuery('campaignEvents', getCampaignEvents(orgId, campId));
    await queryClient.prefetchQuery(['campaign', campId], getCampaign(orgId, campId));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId));

    return {
        props: {
            campId,
            dehydratedState: dehydrate(queryClient),
            orgId
        },
    };
};

type OrgCampaignEventsPageProps = {
    campId: string,
    orgId: string,
}

export default function OrgCampaignEventsPage(props : OrgCampaignEventsPageProps) : JSX.Element {
    const { orgId, campId } = props;
    const campaignEventsQuery = useQuery('campaignEvents', getCampaignEvents(orgId, campId));
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