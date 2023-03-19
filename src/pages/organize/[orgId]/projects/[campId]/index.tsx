import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useQuery } from 'react-query';
import { Box, Grid, Typography } from '@mui/material';

import { campaignTasksResource } from 'features/tasks/api/tasks';
import EventList from 'features/events/components/EventList';
import getCampaign from 'features/campaigns/fetching/getCampaign';
import getCampaignEvents from 'features/campaigns/fetching/getCampaignEvents';
import getOrg from 'utils/fetching/getOrg';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import TaskList from 'features/tasks/components/TaskList';
import { useMessages } from 'core/i18n';
import ZUIPerson from 'zui/ZUIPerson';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import ZUISection from 'zui/ZUISection';

import messageIds from 'features/campaigns/l10n/messageIds';

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
  const messages = useMessages(messageIds);

  const tasksQuery = campaignTasksResource(orgId, campId).useQuery();

  const eventsQuery = useQuery(
    ['campaignEvents', orgId, campId],
    getCampaignEvents(orgId, campId)
  );
  const campaignQuery = useQuery(
    ['campaign', orgId, campId],
    getCampaign(orgId, campId)
  );
  const events = eventsQuery.data || [];
  const tasks = tasksQuery.data || [];
  const campaign = campaignQuery.data;

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
            {campaign?.manager && (
              <Grid item xs={12}>
                <ZUIPersonHoverCard personId={campaign.manager.id}>
                  <ZUIPerson
                    id={campaign.manager.id}
                    name={campaign.manager.name}
                    subtitle={messages.campaignManager()}
                  />
                </ZUIPersonHoverCard>
              </Grid>
            )}
          </Grid>
        </Box>

        <Grid container spacing={2}>
          {/* Events */}
          <Grid item md={6} sm={12} xs={12}>
            <ZUISection title={messages.events()}>
              <EventList
                events={events ?? []}
                hrefBase={`/organize/${orgId}/projects/${campId}`}
              />
            </ZUISection>
          </Grid>

          {/* Tasks */}
          <Grid item md={6} sm={12} xs={12}>
            <ZUISection title={messages.tasks()}>
              <TaskList tasks={tasks ?? []} />
            </ZUISection>
          </Grid>
        </Grid>
      </>
    </>
  );
};

CampaignSummaryPage.getLayout = function getLayout(page) {
  return <SingleCampaignLayout>{page}</SingleCampaignLayout>;
};

export default CampaignSummaryPage;
