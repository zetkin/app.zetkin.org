import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useQuery } from 'react-query';
import { Box, Grid, Typography } from '@mui/material';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import BackendApiClient from 'core/api/client/BackendApiClient';
import CampaignCard from 'features/campaigns/components/CampaignCard';
import getCampaigns from 'features/campaigns/fetching/getCampaigns';
import messageIds from 'features/campaigns/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useAllEvents from 'features/events/hooks/useAllEvents';
import useServerSide from 'core/useServerSide';
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

  const apiClient = new BackendApiClient(ctx.req.headers);
  const campaignsState = await apiClient.get(`/api/orgs/${orgId}/campaigns`);
  const eventsState = await apiClient.get(`/api/orgs/${orgId}/actions`);
  const today = new Date(Date.now()).toISOString();
  const upcomingEventsState = await apiClient.get(
    `/api/orgs/${orgId}/actions?filter=start_time>${today}`
  );
  const orgState = await apiClient.get(`/api/orgs/${orgId}`);

  if (orgState && campaignsState && eventsState && upcomingEventsState) {
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
  const messages = useMessages(messageIds);
  const campaignsQuery = useQuery(['campaigns', orgId], getCampaigns(orgId));
  const events = useAllEvents(parseInt(orgId)).data || [];

  const onServer = useServerSide();
  if (onServer) {
    return null;
  }

  const campaigns = campaignsQuery.data || [];

  return (
    <>
      <Head>
        <title>{messages.layout.allCampaigns()}</title>
      </Head>
      <ActivitiesOverview orgId={parseInt(orgId)} />
      <Box mt={4}>
        <Typography mb={2} variant="h4">
          <Msg id={messageIds.all.heading} />
        </Typography>

        <Grid container spacing={2}>
          {campaigns.map((campaign) => {
            return (
              <Grid key={campaign.id} item lg={3} md={4} xs={12}>
                <CampaignCard campaign={campaign} events={events} />
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
