import { dehydrate } from 'react-query/hydration';
import { GetServerSideProps } from 'next';
import { QueryClient, useQuery } from 'react-query';

import getCampaigns from '../../../fetching/getCampaigns';
import getOrg from '../../../fetching/getOrg';

export const getServerSideProps : GetServerSideProps = async (context) => {
    const queryClient = new QueryClient();
    const { orgId } = context.params;

    await queryClient.prefetchQuery(['campaigns', orgId], getCampaigns(orgId as string));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string));

    const campaignsState = queryClient.getQueryState(['campaigns', orgId]);
    const orgState = queryClient.getQueryState(['org', orgId]);

    if (campaignsState.status === 'success' && orgState.status === 'success') {
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
};

type OrgCampaignsPageProps = {
    orgId: string;
};

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