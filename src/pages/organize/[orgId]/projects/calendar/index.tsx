import { GetServerSideProps } from 'next';
import Head from 'next/head';

import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import Calendar from 'features/calendar/components';
import getOrg from 'utils/fetching/getOrg';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import { useMessages } from 'core/i18n';

import messageIds from 'features/campaigns/l10n/messageIds';
import useServerSide from 'core/useServerSide';

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

  if (orgState?.status === 'success') {
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
> = () => {
  const messages = useMessages(messageIds);
  // const eventsQuery = useQuery(['events', orgId], getEvents(orgId));
  // const campaignsQuery = useQuery(['campaigns', orgId], getCampaigns(orgId));
  // const tasksQuery = tasksResource(orgId).useQuery();
  // const events = eventsQuery.data || [];
  // const tasks = tasksQuery.data || [];
  // const campaigns = campaignsQuery.data || [];

  const isOnServer = useServerSide();
  if (isOnServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{messages.layout.calendar()}</title>
      </Head>
      <Calendar />
    </>
  );
};

AllCampaignsCalendarPage.getLayout = function getLayout(page) {
  return <AllCampaignsLayout fixedHeight>{page}</AllCampaignsLayout>;
};

export default AllCampaignsCalendarPage;
