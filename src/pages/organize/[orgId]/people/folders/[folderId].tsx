import { GetServerSideProps } from 'next';
import Head from 'next/head';

import BackendApiClient from 'core/api/client/BackendApiClient';
import FolderLayout from 'features/views/layout/FolderLayout';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import { useMessages } from 'core/i18n';
import ViewBrowser from 'features/views/components/ViewBrowser';
import messageIds from 'features/views/l10n/messageIds';
import { ZetkinViewFolder } from 'features/views/components/types';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.people'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, folderId } = ctx.params!;

  try {
    const apiClient = new BackendApiClient(ctx.req.headers);
    // Note: We don't actually care for the returned folder, but we still want to perform
    // the api request to know if this user may access this particular folder.
    await apiClient.get<ZetkinViewFolder>(
      `/api/orgs/${orgId}/people/view_folders/${folderId}`
    );
    return {
      props: {
        folderId,
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
