import { GetServerSideProps } from 'next';
import Head from 'next/head';

import BackendApiClient from 'core/api/client/BackendApiClient';
import FolderLayout from 'features/views/layout/FolderLayout';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import { useMessages } from 'core/i18n';
import ViewBrowser from 'features/views/components/ViewBrowser';

import messageIds from 'features/views/l10n/messageIds';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.people'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, folderId } = ctx.params!;

  const apiClient = new BackendApiClient(ctx.req.headers);
  const folder = await apiClient.get(
    `/api/orgs/${orgId}/people/view_folders/${folderId}`
  );

  if (folder) {
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
  const messages = useMessages(messageIds);

  return (
    <>
      <Head>
        <title>{messages.browserLayout.title()}</title>
      </Head>
      <ViewBrowser
        basePath={`/organize/${orgId}/people`}
        folderId={parseInt(folderId)}
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
