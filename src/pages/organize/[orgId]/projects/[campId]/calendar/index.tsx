import { GetServerSideProps } from 'next';
import Head from 'next/head';

import BackendApiClient from 'core/api/client/BackendApiClient';
import Calendar from 'features/calendar/components';
import { campaignTasksResource } from 'features/tasks/api/tasks';
import getCampaignEvents from 'features/campaigns/fetching/getCampaignEvents';
import getOrg from 'utils/fetching/getOrg';
import messageIds from 'features/campaigns/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import useCampaign from 'features/campaigns/hooks/useCampaign';
import { useMessages } from 'core/i18n';
import useServerSide from 'core/useServerSide';
import { ZetkinCampaign } from 'utils/types/zetkin';

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

  try {
    const apiClient = new BackendApiClient(ctx.req.headers);
    await apiClient.get<ZetkinCampaign>(
      `/api/orgs/${orgId}/campaigns/${campId}`
    );
  } catch (error) {
    return {
      notFound: true,
    };
  }

  if (
    orgState?.status === 'success' &&
    campaignEventsState?.status === 'success' &&
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
  const { data: campaign } = useCampaign(parseInt(orgId), parseInt(campId));

  const isOnServer = useServerSide();
  if (isOnServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`${campaign?.title} - ${messages.layout.calendar()}`}</title>
      </Head>
      <Calendar />
    </>
  );
};

CampaignCalendarPage.getLayout = function getLayout(page) {
  return <SingleCampaignLayout fixedHeight>{page}</SingleCampaignLayout>;
};

export default CampaignCalendarPage;
