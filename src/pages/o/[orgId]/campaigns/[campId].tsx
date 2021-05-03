import { GetServerSideProps } from 'next';
import { useQuery } from 'react-query';
import { Flex, Heading, Text } from '@adobe/react-spectrum';

import DefaultOrgLayout from '../../../../components/layout/DefaultOrgLayout';
import EventList from '../../../../components/EventList';
import getBookedEvents from '../../../../fetching/getBookedEvents';
import getCampaign from '../../../../fetching/getCampaign';
import getCampaignEvents from '../../../../fetching/getCampaignEvents';
import getEventResponses from '../../../../fetching/getEventResponses';
import getOrg from '../../../../fetching/getOrg';
import { PageWithLayout } from '../../../../types';
import { scaffold } from '../../../../utils/next';
import { useEventResponses } from '../../../../hooks';

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { campId, orgId } = context.params!;
    const { user } = context;

    await context.queryClient.prefetchQuery(['campaign', campId], getCampaign(orgId as string, campId as string));
    await context.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string));
    await context.queryClient.prefetchQuery(['campaignEvents', campId], getCampaignEvents(orgId as string, campId as string));

    if (user) {
        await context.queryClient.prefetchQuery('eventResponses', getEventResponses(context.apiFetch));
        await context.queryClient.prefetchQuery('bookedEvents', getBookedEvents(context.apiFetch));
    }

    const campaignState = context.queryClient.getQueryState(['campaign', campId]);
    const orgState = context.queryClient.getQueryState(['org', orgId]);
    const campaignEvents = context.queryClient.getQueryState(['campaignEvents', campId]);

    if (campaignEvents?.status === 'success'
        && campaignState?.status === 'success'
        && orgState?.status === 'success') {
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

type CampaignPageProps = {
    campId: string;
    orgId: string;
};

const CampaignPage : PageWithLayout<CampaignPageProps> = (props) => {
    const { campId, orgId } = props;
    const campaignQuery = useQuery(['campaign', campId], getCampaign(orgId, campId));
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));
    const campaignEventsQuery = useQuery(['campaignEvents', campId], getCampaignEvents(orgId, campId));
    const bookedEventsQuery = useQuery('bookedEvents', getBookedEvents());

    const { eventResponses, onSignup, onUndoSignup } = useEventResponses();

    return (
        <Flex direction="column" marginY="size-500">
            <Heading level={ 1 }>
                { campaignQuery.data?.title }
            </Heading>
            <Text data-testid="campaign-information">
                { campaignQuery.data?.info_text }
            </Text>
            <EventList
                bookedEvents={ bookedEventsQuery.data }
                eventResponses={ eventResponses }
                events={ campaignEventsQuery.data }
                onSignup={ onSignup }
                onUndoSignup={ onUndoSignup }
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                org={ orgQuery.data! }
            />
        </Flex>
    );
};

CampaignPage.getLayout = function getLayout(page, props) {
    return (
        <DefaultOrgLayout orgId={ props.orgId as string }>
            { page }
        </DefaultOrgLayout>
    );
};

export default CampaignPage;