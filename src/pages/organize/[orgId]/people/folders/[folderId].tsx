import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';

import FolderLayout from 'features/views/layout/FolderLayout';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useModel from 'core/useModel';
import ViewBrowser from 'features/views/components/ViewBrowser';
import ViewBrowserModel from 'features/views/models/ViewBrowserModel';
import { viewsResource } from 'features/views/api/views';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.people'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, folderId } = ctx.params!;

  const { state: viewsQueryState } = await viewsResource(
    orgId as string
  ).prefetch(ctx);

  if (viewsQueryState?.status === 'success') {
    return {
      props: {
        folderId,
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
  folderId: string;
  orgId: string;
};

const PeopleViewsPage: PageWithLayout<PeopleViewsPageProps> = ({
  folderId,
  orgId,
}) => {
  const intl = useIntl();
  const model: ViewBrowserModel = useModel(
    (env) => new ViewBrowserModel(env, parseInt(orgId))
  );

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({
            id: 'layout.organize.people.title',
          })}
        </title>
      </Head>
      <ViewBrowser
        basePath={`/organize/${orgId}/people`}
        folderId={parseInt(folderId)}
        model={model}
      />
    </>
  );
};

PeopleViewsPage.getLayout = function getLayout(page, props) {
  return (
    <FolderLayout folderId={parseInt(props.folderId)}>{page}</FolderLayout>
  );
};

export default PeopleViewsPage;
