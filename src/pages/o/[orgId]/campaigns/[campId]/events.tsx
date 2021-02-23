import { dehydrate } from 'react-query/hydration';
import { GetServerSideProps } from 'next';
import { QueryClient, useQuery } from 'react-query';

import getCampaign from '../../../../../fetching/getCampaign';
import getCampaignEvents from '../../../../../fetching/getCampaignEvents';
import getOrg from '../../../../../fetching/getOrg';

export const getServerSideProps : GetServerSideProps = async (context) => {
    const queryClient = new QueryClient();
    const { orgId, campId } = context.params;

    await queryClient.prefetchQuery(['campaignEvents', campId], getCampaignEvents(orgId as string, campId as string));
    await queryClient.prefetchQuery(['campaign', campId], getCampaign(orgId as string, campId as string));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string));

    const campaignEvents = queryClient.getQueryState(['campaignEvents', campId]);
    const campaignState = queryClient.getQueryState(['campaign', campId]);
    const orgState = queryClient.getQueryState(['org', orgId]);

    if (campaignEvents.status === 'success' && campaignState.status === 'success' && orgState.status === 'success') {
        return {
            props: {
                campId,
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

type OrgCampaignEventsPageProps = {
    campId: string;
    orgId: string;
};

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