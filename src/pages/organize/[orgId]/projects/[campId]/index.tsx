import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Box, Grid, Typography } from '@mui/material';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { campaignTasksResource } from 'features/tasks/api/tasks';
import getOrg from 'utils/fetching/getOrg';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import { Suspense } from 'react';
import useCampaign from 'features/campaigns/hooks/useCampaign';
import useServerSide from 'core/useServerSide';
import { ZetkinCampaign } from 'utils/types/zetkin';

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

  try {
    const apiClient = new BackendApiClient(ctx.req.headers);
    await apiClient.get<ZetkinCampaign>(`/api/orgs/${orgId}/campaigns/`);
  } catch (error) {
    return {
      notFound: true,
    };
  }

  if (
    orgState?.status === 'success' &&
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
        <Suspense>
          <ActivitiesOverview
            campaignId={parseInt(campId)}
            orgId={parseInt(orgId)}
          />
        </Suspense>
      </>
    </>
  );
};

CampaignSummaryPage.getLayout = function getLayout(page) {
  return <SingleCampaignLayout>{page}</SingleCampaignLayout>;
};

export default CampaignSummaryPage;
