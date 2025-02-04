import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Suspense } from 'react';
import { Box, Grid, Typography } from '@mui/material';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import BackendApiClient from 'core/api/client/BackendApiClient';
import CampaignCard from 'features/campaigns/components/CampaignCard';
import messageIds from 'features/campaigns/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SharedCard from 'features/campaigns/components/SharedCard';
import useCampaigns from 'features/campaigns/hooks/useCampaigns';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import useSurveys from 'features/surveys/hooks/useSurveys';
import { Msg, useMessages } from 'core/i18n';
import { useRouter } from 'next/router';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: [
    'layout.organize',
    'misc.breadcrumbs',
    'pages.organizeAllCampaigns',
    'misc.formDialog',
  ],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;

  const apiClient = new BackendApiClient(ctx.req.headers);
  const orgState = await apiClient.get(`/api/orgs/${orgId}`);

  if (orgState) {
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
  const router = useRouter();
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  if (!orgId) {
    router.reload();
  }
  const { data: campaigns } = useCampaigns(orgId);
  campaigns?.reverse();

  const onServer = useServerSide();
  const surveys = useSurveys(orgId).data ?? [];

  if (onServer) {
    return null;
  }
  //The shared card is currently only visible when there are shared surveys, but there will be more shared activities in the future.
  const sharedSurveys = surveys.filter(
    (survey) =>
      survey.org_access === 'suborgs' && survey.organization.id != orgId
  );

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
          {sharedSurveys.length > 0 && (
            <Grid item lg={3} md={4} xs={12}>
              <SharedCard />
            </Grid>
          )}
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
