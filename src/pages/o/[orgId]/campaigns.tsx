import { dehydrate } from 'react-query/hydration';
import { GetServerSideProps } from 'next';
import { QueryClient, useQuery } from 'react-query';

import getCampaigns from '../../../fetching/getCampaigns';
import getOrg from '../../../fetching/getOrg';
import OrgLayout from '../../../components/layout/OrgLayout';
import { PageWithLayout } from '../../../types';
import { scaffold } from '../../../utils/next';

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    const queryClient = new QueryClient();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId } = context.params!;

    await queryClient.prefetchQuery(['campaigns', orgId], getCampaigns(orgId as string));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string));

    const campaignsState = queryClient.getQueryState(['campaigns', orgId]);
    const orgState = queryClient.getQueryState(['org', orgId]);

    if (campaignsState?.status === 'success' && orgState?.status === 'success') {
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
});

type OrgCampaignsPageProps = {
    orgId: string;
};

const OrgCampaignsPage : PageWithLayout<OrgCampaignsPageProps> = (props) => {
    const { orgId } = props;
    const campaignsQuery = useQuery(['campaigns', orgId], getCampaigns(orgId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <>
            <h1>Campaigns for { orgQuery.data?.title }</h1>
            <ul>
                { campaignsQuery.data?.map((c) => (
                    <li key={ c.id }>{ c.title }</li>
                )) }
            </ul>
        </>
    );
};

OrgCampaignsPage.getLayout = function getLayout(page, props) {
    return (
        <OrgLayout orgId={ props.orgId as string }>
            { page }
        </OrgLayout>
    );
};

export default OrgCampaignsPage;