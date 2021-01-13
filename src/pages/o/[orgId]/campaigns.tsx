import { GetServerSideProps } from 'next';
import { dehydrate } from 'react-query/hydration';
import { QueryClient, useQuery } from 'react-query';

function getCampaigns(orgId) {
    return async () => {
        try {
            const cRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/campaigns`);
            const cData = await cRes.json();

            return cData.data;
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

    await queryClient.prefetchQuery(['campaigns', orgId], getCampaigns(orgId));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId));

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            orgId
        },
    };
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