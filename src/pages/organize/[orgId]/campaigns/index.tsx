import { GetServerSideProps } from 'next';

import { Box } from '@material-ui/core';
import Head from 'next/head';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import CampaignCard from 'features/campaigns/components/CampaignCard';
import getCampaigns from 'features/campaigns/fetching/getCampaigns';
import getEvents from 'features/events/fetching/getEvents';
import getOrg from 'utils/fetching/getOrg';
import getUpcomingEvents from 'features/events/fetching/getUpcomingEvents';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import ZUISection from 'zui/ZUISection';
import ZUISpeedDial, { ACTIONS } from 'zui/ZUISpeedDial';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: [
    'layout.organize',
    'misc.breadcrumbs',
    'pages.organizeAllCampaigns',
    'misc.formDialog',
    'misc.speedDial',
  ],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;

  await ctx.queryClient.prefetchQuery(
    ['org', orgId],
    getOrg(orgId as string, ctx.apiFetch)
  );
  const orgState = ctx.queryClient.getQueryState(['org', orgId]);

  await ctx.queryClient.prefetchQuery(
    ['campaigns', orgId],
    getCampaigns(orgId as string, ctx.apiFetch)
  );
  const campaignsState = ctx.queryClient.getQueryState(['campaigns', orgId]);

  await ctx.queryClient.prefetchQuery(
    ['upcomingEvents', orgId],
    getUpcomingEvents(orgId as string, ctx.apiFetch)
  );
  const upcomingEventsState = ctx.queryClient.getQueryState([
    'upcomingEvents',
    orgId,
  ]);

  await ctx.queryClient.prefetchQuery(
    ['events', orgId],
    getEvents(orgId as string, ctx.apiFetch)
  );
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
  } else {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

type AllCampaignsSummaryPageProps = {
  orgId: string;
};

const AllCampaignsSummaryPage: PageWithLayout<AllCampaignsSummaryPageProps> = ({
  orgId,
}) => {
  const intl = useIntl();
  const campaignsQuery = useQuery(['campaigns', orgId], getCampaigns(orgId));
  const eventsQuery = useQuery(['events', orgId], getEvents(orgId));

  const campaigns = campaignsQuery.data || [];
  const events = eventsQuery.data || [];

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({
            id: 'layout.organize.campaigns.allCampaigns',
          })}
        </title>
      </Head>
      <ZUISection
        title={intl.formatMessage({
          id: 'pages.organizeAllCampaigns.heading',
        })}
      >
        <Box
          display="grid"
          gridGap={20}
          gridTemplateColumns="repeat( auto-fit, minmax(450px, 1fr) )"
        >
          {campaigns.map((campaign) => {
            return (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                events={events}
              />
            );
          })}
        </Box>
      </ZUISection>
      <ZUISpeedDial actions={[ACTIONS.CREATE_CAMPAIGN]} />
    </>
  );
};

AllCampaignsSummaryPage.getLayout = function getLayout(page) {
  return <AllCampaignsLayout>{page}</AllCampaignsLayout>;
};

export default AllCampaignsSummaryPage;
