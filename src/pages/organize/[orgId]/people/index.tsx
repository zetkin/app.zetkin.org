import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';

import { PageWithLayout } from 'utils/types';
import PeopleLayout from 'features/views/layout/PeopleLayout';
import { scaffold } from 'utils/next';
import useModel from 'core/useModel';
import useServerSide from 'core/useServerSide';
import ViewBrowser from 'features/views/components/ViewBrowser';
import ViewBrowserModel from 'features/views/models/ViewBrowserModel';
import { viewsResource } from 'features/views/api/views';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.people'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;

  const { state: viewsQueryState } = await viewsResource(
    orgId as string
  ).prefetch(ctx);

  if (viewsQueryState?.status === 'success') {
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
  const intl = useIntl();
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
        <title>
          {intl.formatMessage({
            id: 'layout.organize.people.title',
          })}
        </title>
      </Head>
      <ViewBrowser basePath={`/organize/${orgId}/people`} model={model} />
    </>
  );
};

PeopleViewsPage.getLayout = function getLayout(page) {
  return <PeopleLayout>{page}</PeopleLayout>;
};

export default PeopleViewsPage;
