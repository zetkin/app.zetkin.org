import { GetServerSideProps } from 'next';
import Head from 'next/head';

import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import BackendApiClient from 'core/api/client/BackendApiClient';
import Calendar from 'features/calendar/components';
import messageIds from 'features/campaigns/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import { useMessages } from 'core/i18n';
import useServerSide from 'core/useServerSide';
import { ZetkinOrganization } from 'utils/types/zetkin';

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

  const apiClient = new BackendApiClient(ctx.req.headers);
  try {
    await apiClient.get<ZetkinOrganization>(`/api/orgs/${orgId}`);
    return {
      props: {},
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

const AllCampaignsCalendarPage: PageWithLayout = () => {
  const messages = useMessages(messageIds);

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
