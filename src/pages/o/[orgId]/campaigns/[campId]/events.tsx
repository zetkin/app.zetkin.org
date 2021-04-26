import { GetServerSideProps } from 'next';
import { useQuery } from 'react-query';

import DefaultOrgLayout from '../../../../../components/layout/DefaultOrgLayout';
import getCampaign from '../../../../../fetching/getCampaign';
import getCampaignEvents from '../../../../../fetching/getCampaignEvents';
import getOrg from '../../../../../fetching/getOrg';
import { PageWithLayout } from '../../../../../types';
import { scaffold } from '../../../../../utils/next';

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId, campId } = context.params!;

    await context.queryClient.prefetchQuery(['campaignEvents', campId], getCampaignEvents(orgId as string, campId as string));
    await context.queryClient.prefetchQuery(['campaign', campId], getCampaign(orgId as string, campId as string));
    await context.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string));

    const campaignEvents = context.queryClient.getQueryState(['campaignEvents', campId]);
    const campaignState = context.queryClient.getQueryState(['campaign', campId]);
    const orgState = context.queryClient.getQueryState(['org', orgId]);

    if (campaignEvents?.status === 'success' && campaignState?.status === 'success' && orgState?.status === 'success') {
        return {
            props: {
                campId,
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

type CampaignEventsPageProps = {
    campId: string;
    orgId: string;
};

const CampaignEventsPage : PageWithLayout<CampaignEventsPageProps> = (props) => {
    const { orgId, campId } = props;
    const campaignEventsQuery = useQuery(['campaignEvents', campId], getCampaignEvents(orgId, campId));
    const campaignQuery = useQuery(['campaign', campId], getCampaign(orgId, campId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));

    return (
        <>
            <h1>{ orgQuery.data?.title }</h1>
            <h1>{ campaignQuery.data?.title }</h1>
            <ul>
                { campaignEventsQuery.data?.map((e) => (
                    <li key={ e.id }>{ e.activity.title }</li>
                )) }
            </ul>
        </>
    );
};

CampaignEventsPage.getLayout = function getLayout(page, props) {
    return (
        <DefaultOrgLayout orgId={ props.orgId as string }>
            { page }
        </DefaultOrgLayout>
    );
};

export default CampaignEventsPage;