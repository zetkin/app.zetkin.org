import { GetServerSideProps } from 'next';
import Head from 'next/head';

import AllProjectsLayout from 'features/projects/layout/AllProjectsLayout';
import BackendApiClient from 'core/api/client/BackendApiClient';
import Calendar from 'features/calendar/components';
import messageIds from 'features/projects/l10n/messageIds';
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

const AllProjectsCalendarPage: PageWithLayout = () => {
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

AllProjectsCalendarPage.getLayout = function getLayout(page) {
  return <AllProjectsLayout fixedHeight>{page}</AllProjectsLayout>;
};

export default AllProjectsCalendarPage;
