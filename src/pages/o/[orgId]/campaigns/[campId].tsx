//TODO: Enable eslint rule and fix errors
/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { dehydrate } from 'react-query/hydration';
import EventList from '../../../../components/EventList';
import { GetServerSideProps } from 'next';
import { Flex, Heading, Text } from '@adobe/react-spectrum';
import { QueryClient, useQuery } from 'react-query';

import getCampaign from '../../../../fetching/getCampaign';
import getCampaignEvents from '../../../../fetching/getCampaignEvents';
import getOrg from '../../../../fetching/getOrg';


export const getServerSideProps : GetServerSideProps = async (context) => {
    const queryClient = new QueryClient();
    const { campId, orgId } = context.params!;

    await queryClient.prefetchQuery(['campaign', campId], getCampaign(orgId as string, campId as string));
    await queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string));
    await queryClient.prefetchQuery(['campaignEvents', campId], getCampaignEvents(orgId as string, campId as string));

    const campaignState = queryClient.getQueryState(['campaign', campId]);
    const orgState = queryClient.getQueryState(['org', orgId]);
    const campaignEvents = queryClient.getQueryState(['campaignEvents', campId]);

    if (campaignEvents!.status === 'success' && campaignState!.status === 'success' && orgState!.status === 'success') {
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

type OrgCampaignPageProps = {
    campId: string;
    orgId: string;
};

export default function OrgCampaignPage(props : OrgCampaignPageProps) : JSX.Element {
    const { campId, orgId } = props;
    const campaignQuery = useQuery(['campaign', campId], getCampaign(orgId, campId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));
    const campaignEventsQuery = useQuery(['campaignEvents', campId], getCampaignEvents(orgId, campId));

    return (
        <Flex direction="column" marginY="size-500">
            <Heading level={ 1 }>
                { campaignQuery.data!.title }
            </Heading>
            <Text data-test="campaign-information">
                { campaignQuery.data!.info_text }
            </Text>
            <EventList
                events={ campaignEventsQuery.data! }
                org={ orgQuery.data! }
            />
        </Flex>
    );
}