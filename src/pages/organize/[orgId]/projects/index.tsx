import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Box, Grid, Typography } from '@mui/material';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import BackendApiClient from 'core/api/client/BackendApiClient';
import CampaignCard from 'features/campaigns/components/CampaignCard';
import getEvents from 'features/events/fetching/getEvents';
import getOrg from 'utils/fetching/getOrg';
import getUpcomingEvents from 'features/events/fetching/getUpcomingEvents';
import messageIds from 'features/campaigns/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import { Suspense } from 'react';
import useCampaigns from 'features/campaigns/hooks/useCampaigns';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import { ZetkinCampaign } from 'utils/types/zetkin';
import { Msg, useMessages } from 'core/i18n';

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

  try {
    const apiClient = new BackendApiClient(ctx.req.headers);
    await apiClient.get<ZetkinCampaign[]>(`/api/orgs/${orgId}/campaigns/`);
  } catch (error) {
    return {
      notFound: true,
    };
  }

  if (
    orgState?.status === 'success' &&
    eventsState?.status === 'success' &&
    upcomingEventsState?.status === 'success'
  ) {
    return {
      props: {},
    };
  } else {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

const AllCampaignsSummaryPage: PageWithLayout = () => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const { data: campaigns } = useCampaigns(orgId);
  const onServer = useServerSide();

  if (onServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{messages.layout.allCampaigns()}</title>
      </Head>
      <Suspense>
        <ActivitiesOverview orgId={orgId} />
      </Suspense>
      <Box mt={4}>
        <Typography mb={2} variant="h4">
          <Msg id={messageIds.all.heading} />
        </Typography>

        <Grid container spacing={2}>
          {campaigns?.map((campaign) => {
            return (
              <Grid key={campaign.id} item lg={3} md={4} xs={12}>
                <CampaignCard campaign={campaign} />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
};

AllCampaignsSummaryPage.getLayout = function getLayout(page) {
  return <AllCampaignsLayout>{page}</AllCampaignsLayout>;
};

export default AllCampaignsSummaryPage;
