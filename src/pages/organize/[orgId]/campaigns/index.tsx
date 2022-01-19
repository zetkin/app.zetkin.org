import { GetServerSideProps } from 'next';

import { Box } from '@material-ui/core';
import Head from 'next/head';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import AllCampaignsLayout from 'components/layout/organize/AllCampaignsLayout';
import CampaignCard from 'components/organize/campaigns/CampaignCard';
import getCampaigns from 'fetching/getCampaigns';
import getEvents from 'fetching/getEvents';
import getOrg from 'fetching/getOrg';
import getUpcomingEvents from 'fetching/getUpcomingEvents';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import ZetkinSection from 'components/ZetkinSection';
import ZetkinSpeedDial, { ACTIONS } from 'components/ZetkinSpeedDial';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs', 'pages.organizeAllCampaigns', 'misc.formDialog', 'misc.speedDial',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId } = ctx.params!;

    await ctx.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string, ctx.apiFetch));
    const orgState = ctx.queryClient.getQueryState(['org', orgId]);

    await ctx.queryClient.prefetchQuery(['campaigns', orgId], getCampaigns(orgId as string, ctx.apiFetch));
    const campaignsState = ctx.queryClient.getQueryState(['campaigns', orgId]);

    await ctx.queryClient.prefetchQuery(['upcomingEvents', orgId], getUpcomingEvents(orgId as string, ctx.apiFetch));
    const upcomingEventsState = ctx.queryClient.getQueryState(['upcomingEvents', orgId]);

    await ctx.queryClient.prefetchQuery(['events', orgId], getEvents(orgId as string, ctx.apiFetch));
    const eventsState = ctx.queryClient.getQueryState(['events', orgId]);

    if (
        orgState?.status === 'success' &&
        campaignsState?.status === 'success' &&
        eventsState?.status === 'success' &&
        upcomingEventsState?.status === 'success'
    ) {
        return {
            props: {
                orgId,
            },
        };
    }
    else {
        return {
            notFound: true,
        };
    }
}, scaffoldOptions);

type AllCampaignsSummaryPageProps = {
    orgId: string;
};

const AllCampaignsSummaryPage: PageWithLayout<AllCampaignsSummaryPageProps> = ({ orgId }) => {
    const intl = useIntl();
    const campaignsQuery = useQuery(['campaigns', orgId], getCampaigns(orgId));
    const eventsQuery = useQuery(['events', orgId], getEvents(orgId));

    const campaigns = campaignsQuery.data || [];
    const events = eventsQuery.data || [];

    return (
        <>
            <Head>
                <title>{ intl.formatMessage({ id:'layout.organize.campaigns.allCampaigns' }) }</title>
            </Head>
            <ZetkinSection title={ intl.formatMessage({ id: 'pages.organizeAllCampaigns.heading' }) }>
                <Box display="grid" gridGap={ 20 } gridTemplateColumns="repeat( auto-fit, minmax(450px, 1fr) )">
                    { campaigns.map(campaign => { //här
                        return (<CampaignCard
                            key={ campaign.id }
                            campaign={ campaign }
                            events={ events }
                        />);
                    }) }
                </Box>
            </ZetkinSection>
            <ZetkinSpeedDial actions={ [ACTIONS.CREATE_CAMPAIGN] } />
        </>
    );
};

AllCampaignsSummaryPage.getLayout = function getLayout(page) {
    return (
        <AllCampaignsLayout>
            { page }
        </AllCampaignsLayout>
    );
};

export default AllCampaignsSummaryPage;
