import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useQuery } from 'react-query';

import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import Calendar from 'features/calendar/components';
import getCampaigns from 'features/campaigns/fetching/getCampaigns';
import getEvents from 'features/events/fetching/getEvents';
import getOrg from 'utils/fetching/getOrg';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import { tasksResource } from 'features/tasks/api/tasks';
import { useMessages } from 'core/i18n';
import ZUISpeedDial, { ACTIONS } from 'zui/ZUISpeedDial';

import messageIds from 'features/campaigns/l10n/messageIds';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: [
    'layout.organize',
    'misc.breadcrumbs',
    'misc.calendar',
    'misc.speedDial',
    'misc.formDialog',
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
    ['events', orgId],
    getEvents(orgId as string, ctx.apiFetch)
  );
  const eventsState = ctx.queryClient.getQueryState(['events', orgId]);

  await ctx.queryClient.prefetchQuery(
    ['campaigns', orgId],
    getCampaigns(orgId as string, ctx.apiFetch)
  );
  const campaignsState = ctx.queryClient.getQueryState(['campaigns', orgId]);

  const { prefetch: prefetchTasks } = tasksResource(orgId as string);
  const { state: tasksState } = await prefetchTasks(ctx);

  if (
    orgState?.status === 'success' &&
    eventsState?.status === 'success' &&
    campaignsState?.status === 'success' &&
    tasksState?.status === 'success'
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

type AllCampaignsCalendarPageProps = {
  orgId: string;
};

const AllCampaignsCalendarPage: PageWithLayout<
  AllCampaignsCalendarPageProps
> = ({ orgId }) => {
  const messages = useMessages(messageIds);
  const eventsQuery = useQuery(['events', orgId], getEvents(orgId));
  const campaignsQuery = useQuery(['campaigns', orgId], getCampaigns(orgId));
  const tasksQuery = tasksResource(orgId).useQuery();
  const events = eventsQuery.data || [];
  const tasks = tasksQuery.data || [];
  const campaigns = campaignsQuery.data || [];

  return (
    <>
      <Head>
        <title>{messages.layout.calendar()}</title>
      </Head>
      <Calendar
        baseHref={`/organize/${orgId}/campaigns/calendar`}
        campaigns={campaigns}
        events={events}
        tasks={tasks}
      />
      <ZUISpeedDial actions={[ACTIONS.CREATE_CAMPAIGN]} />
    </>
  );
};

AllCampaignsCalendarPage.getLayout = function getLayout(page) {
  return <AllCampaignsLayout fixedHeight>{page}</AllCampaignsLayout>;
};

export default AllCampaignsCalendarPage;
