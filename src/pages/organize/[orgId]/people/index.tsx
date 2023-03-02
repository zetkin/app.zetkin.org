import { GetServerSideProps } from 'next';
import Head from 'next/head';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { PageWithLayout } from 'utils/types';
import PeopleLayout from 'features/views/layout/PeopleLayout';
import { scaffold } from 'utils/next';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import useServerSide from 'core/useServerSide';
import ViewBrowser from 'features/views/components/ViewBrowser';
import ViewBrowserModel from 'features/views/models/ViewBrowserModel';

import messageIds from 'features/views/l10n/messageIds';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.people'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;

  const apiClient = new BackendApiClient(ctx.req.headers);
  const views = await apiClient.get(`/api/orgs/${orgId}/people/views`);

  if (views) {
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

type PeopleViewsPageProps = {
  orgId: string;
};

const PeopleViewsPage: PageWithLayout<PeopleViewsPageProps> = ({ orgId }) => {
  const messages = useMessages(messageIds);
  const model: ViewBrowserModel = useModel(
    (env) => new ViewBrowserModel(env, parseInt(orgId))
  );

  const onServer = useServerSide();
  if (onServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{messages.browserLayout.title()}</title>
      </Head>
      <ViewBrowser basePath={`/organize/${orgId}/people`} model={model} />
    </>
  );
};

PeopleViewsPage.getLayout = function getLayout(page) {
  return <PeopleLayout>{page}</PeopleLayout>;
};

export default PeopleViewsPage;
