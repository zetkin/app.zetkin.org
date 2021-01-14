import { GetServerSideProps } from 'next';
import { dehydrate } from 'react-query/hydration';
import { QueryClient, useQuery } from 'react-query';

function getCampaigns(orgId) {
    return async () => {
        const cRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/campaigns`);
        const cData = await cRes.json();
        if (cData.data) {
            return cData.data;
        }
        throw 'not found';
    };
}

function getOrg(orgId) {
    return async () => {
        const oRes = await fetch(`http://localhost:3000/api/orgs/${orgId}`);
        const oData = await oRes.json();
        if (oData.data) {
            return oData.data;
        }
        throw 'not found';
    };
}

export const getServerSideProps : GetServerSideProps = async (context) => {
    const queryClient = new QueryClient();
    const { orgId } = context.params;

    await queryClient.prefetchQuery(['campaigns', orgId], getCampaigns(orgId));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId));

    const campaignsState = queryClient.getQueryState(['campaigns', orgId]);
    const orgState = queryClient.getQueryState(['org', orgId]);

    if (campaignsState.status === 'success' && orgState.status === 'success') {
        return {
            props: {
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

type OrgCampaignsPageProps = {
    orgId: string,
}

export default function OrgCampaignsPage(props : OrgCampaignsPageProps) : JSX.Element {
    const { orgId } = props;
    const campaignsQuery = useQuery(['campaigns', orgId], getCampaigns(orgId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <>
            <h1>Campaigns for { orgQuery.data.title }</h1>
            <ul>
                { campaignsQuery.data.map((c) => (
                    <li key={ c.id }>{ c.title }</li>
                )) }
            </ul>
        </>
    );
}