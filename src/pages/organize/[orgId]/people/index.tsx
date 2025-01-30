import { GetServerSideProps } from 'next';
import Head from 'next/head';

import BackendApiClient from 'core/api/client/BackendApiClient';
import messageIds from 'features/views/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import PeopleLayout from 'features/views/layout/PeopleLayout';
import { scaffold } from 'utils/next';
import { useMessages } from 'core/i18n';
import useServerSide from 'core/useServerSide';
import ViewBrowser from 'features/views/components/ViewBrowser';
import { ZetkinView } from 'features/views/components/types';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.people'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;

  try {
    const apiClient = new BackendApiClient(ctx.req.headers);
    // Note: We don't actually care for the returned orgnaization, but we still want to perform
    // the api request to know if this user may access this particular page.
    await apiClient.get<ZetkinView[]>(`/api/orgs/${orgId}/people/views`);
    return {
      props: {
        orgId,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

type PeopleViewsPageProps = {
  orgId: string;
};

const PeopleViewsPage: PageWithLayout<PeopleViewsPageProps> = ({ orgId }) => {
  const onServer = useServerSide();
  const messages = useMessages(messageIds);
  if (onServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{messages.browserLayout.title()}</title>
      </Head>
      <ViewBrowser basePath={`/organize/${orgId}/people`} />
    </>
  );
};

PeopleViewsPage.getLayout = function getLayout(page) {
  return <PeopleLayout>{page}</PeopleLayout>;
};

export default PeopleViewsPage;
