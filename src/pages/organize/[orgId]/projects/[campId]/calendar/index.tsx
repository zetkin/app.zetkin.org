import { GetServerSideProps } from 'next';
import Head from 'next/head';

import BackendApiClient from 'core/api/client/BackendApiClient';
import Calendar from 'features/calendar/components';
import getCampaign from 'features/campaigns/fetching/getCampaign';
import getCampaignEvents from 'features/campaigns/fetching/getCampaignEvents';
import getOrg from 'utils/fetching/getOrg';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import { useQuery } from 'react-query';

import { useMessages } from 'core/i18n';

import messageIds from 'features/campaigns/l10n/messageIds';
import useServerSide from 'core/useServerSide';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: [
    'layout.organize',
    'misc.breadcrumbs',
    'misc.calendar',
    'misc.formDialog',
    'misc.speedDial',
    'misc.tasks',
    'pages.organizeCampaigns',
  ],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId } = ctx.params!;

  const apiClient = new BackendApiClient(ctx.req.headers);

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

  await ctx.queryClient.prefetchQuery(['tasks', orgId, campId], async () => {
    return await apiClient.get(`/api/orgs/${orgId}/campaigns/${campId}/tasks`);
  });
  const campaignTasksState = ctx.queryClient.getQueryState([
    'tasks',
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

type OrganizeCalendarPageProps = {
  campId: string;
  orgId: string;
};

const CampaignCalendarPage: PageWithLayout<OrganizeCalendarPageProps> = ({
  orgId,
  campId,
}) => {
  const messages = useMessages(messageIds);
  const campaignQuery = useQuery(
    ['campaign', orgId, campId],
    getCampaign(orgId, campId)
  );

  const isOnServer = useServerSide();
  if (isOnServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {`${campaignQuery.data?.title} - ${messages.layout.calendar()}`}
        </title>
      </Head>
      <Calendar />
    </>
  );
};

CampaignCalendarPage.getLayout = function getLayout(page) {
  return <SingleCampaignLayout fixedHeight>{page}</SingleCampaignLayout>;
};

export default CampaignCalendarPage;
