import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Box, Grid, Typography } from '@mui/material';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import { campaignTasksResource } from 'features/tasks/api/tasks';
import getCampaign from 'features/campaigns/fetching/getCampaign';
import getCampaignEvents from 'features/campaigns/fetching/getCampaignEvents';
import getOrg from 'utils/fetching/getOrg';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import useCampaign from 'features/campaigns/hooks/useCampaign';
import useServerSide from 'core/useServerSide';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.organizeCampaigns'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId } = ctx.params!;

  const { prefetch: prefetchCampaignTasks } = campaignTasksResource(
    orgId as string,
    campId as string
  );
  const { state: campaignTasksState } = await prefetchCampaignTasks(ctx);

  await ctx.queryClient.prefetchQuery(
    ['org', orgId],
    getOrg(orgId as string, ctx.apiFetch)
  );
  const orgState = ctx.queryClient.getQueryState(['org', orgId]);

  await ctx.queryClient.prefetchQuery(
    ['campaignEvents', orgId, campId],
    getCampaignEvents(orgId as string, campId as string, ctx.apiFetch)
  );
  const campaignEventsState = ctx.queryClient.getQueryState([
    'campaignEvents',
    orgId,
    campId,
  ]);

  await ctx.queryClient.prefetchQuery(
    ['campaign', orgId, campId],
    getCampaign(orgId as string, campId as string, ctx.apiFetch)
  );
  const campaignState = ctx.queryClient.getQueryState([
    'campaign',
    orgId,
    campId,
  ]);

  if (
    orgState?.status === 'success' &&
    campaignEventsState?.status === 'success' &&
    campaignState?.status === 'success' &&
    campaignTasksState?.status === 'success'
  ) {
    return {
      props: {
        campId,
        orgId,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

type CampaignCalendarPageProps = {
  campId: string;
  orgId: string;
};

const CampaignSummaryPage: PageWithLayout<CampaignCalendarPageProps> = ({
  orgId,
  campId,
}) => {
  const isOnServer = useServerSide();
  const { data: campaign } = useCampaign(parseInt(orgId), parseInt(campId));

  if (isOnServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{campaign?.title}</title>
      </Head>
      <>
        <Box mb={campaign?.info_text || campaign?.manager ? 2 : 0}>
          <Grid container spacing={2}>
            {campaign?.info_text && (
              <Grid item lg={6} md={12} xs={12}>
                <Typography variant="body1">{campaign?.info_text}</Typography>
              </Grid>
            )}
          </Grid>
        </Box>
        <ActivitiesOverview
          campaignId={parseInt(campId)}
          orgId={parseInt(orgId)}
        />
      </>
    </>
  );
};

CampaignSummaryPage.getLayout = function getLayout(page) {
  return <SingleCampaignLayout>{page}</SingleCampaignLayout>;
};

export default CampaignSummaryPage;
