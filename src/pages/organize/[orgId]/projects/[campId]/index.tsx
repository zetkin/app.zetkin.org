import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Box, Grid, Typography } from '@mui/material';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { campaignTasksResource } from 'features/tasks/api/tasks';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import { Suspense } from 'react';
import useCampaign from 'features/campaigns/hooks/useCampaign';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import { ZetkinCampaign, ZetkinOrganization } from 'utils/types/zetkin';

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

  const apiClient = new BackendApiClient(ctx.req.headers);
  const organization = await apiClient.get<ZetkinOrganization>(
    `/api/orgs/${orgId}`
  );
  const campaign = await apiClient.get<ZetkinCampaign>(
    `/api/orgs/${orgId}/campaigns/`
  );

  if (organization && campaign && campaignTasksState?.status === 'success') {
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

const CampaignSummaryPage: PageWithLayout = () => {
  const isOnServer = useServerSide();
  const { orgId, campId } = useNumericRouteParams();
  const { campaignFuture } = useCampaign(orgId, campId);
  const campaign = campaignFuture.data;

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
          <ActivitiesOverview campaignId={campId} orgId={orgId} />
        </Suspense>
      </>
    </>
  );
};

CampaignSummaryPage.getLayout = function getLayout(page) {
  return <SingleCampaignLayout>{page}</SingleCampaignLayout>;
};

export default CampaignSummaryPage;
