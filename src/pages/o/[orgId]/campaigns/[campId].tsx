import { dehydrate } from 'react-query/hydration';
import EventList from '../../../../components/EventList';
import { GetServerSideProps } from 'next';
import { Flex, Heading, Text } from '@adobe/react-spectrum';
import { QueryClient, useQuery } from 'react-query';

import getCampaign from '../../../../fetching/getCampaign';
import getCampaignEvents from '../../../../fetching/getCampaignEvents';
import getOrg from '../../../../fetching/getOrg';
import { PageWithLayout } from '../../../../types';
import { scaffold } from '../../../../utils/next';
import SimpleOrgLayout from '../../../../components/layout/SimpleOrgLayout';

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    const queryClient = new QueryClient();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { campId, orgId } = context.params!;

    await queryClient.prefetchQuery(['campaign', campId], getCampaign(orgId as string, campId as string));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string));
    await queryClient.prefetchQuery(['campaignEvents', campId], getCampaignEvents(orgId as string, campId as string));

    const campaignState = queryClient.getQueryState(['campaign', campId]);
    const orgState = queryClient.getQueryState(['org', orgId]);
    const campaignEvents = queryClient.getQueryState(['campaignEvents', campId]);

    if (campaignEvents?.status === 'success' && campaignState?.status === 'success' && orgState?.status === 'success') {
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
});

type OrgCampaignPageProps = {
    campId: string;
    orgId: string;
};

const OrgCampaignPage : PageWithLayout<OrgCampaignPageProps> = (props) => {
    const { campId, orgId } = props;
    const campaignQuery = useQuery(['campaign', campId], getCampaign(orgId, campId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));
    const campaignEventsQuery = useQuery(['campaignEvents', campId], getCampaignEvents(orgId, campId));

    return (
        <Flex direction="column" marginY="size-500">
            <Heading level={ 1 }>
                { campaignQuery.data?.title }
            </Heading>
            <Text data-test="campaign-information">
                { campaignQuery.data?.info_text }
            </Text>
            <EventList
                events={ campaignEventsQuery.data }
                org={ orgQuery.data }
            />
        </Flex>
    );
};

OrgCampaignPage.getLayout = function getLayout(page, props) {
    return (
        <SimpleOrgLayout orgId={ props.orgId as string }>
            { page }
        </SimpleOrgLayout>
    );
};

export default OrgCampaignPage;