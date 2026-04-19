import { GetServerSideProps } from 'next';
import Head from 'next/head';

import BackendApiClient from 'core/api/client/BackendApiClient';
import Calendar from 'features/calendar/components';
import messageIds from 'features/projects/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleProjectLayout from 'features/projects/layout/SingleProjectLayout';
import useProject from 'features/projects/hooks/useProject';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import { ZetkinProject } from 'utils/types/zetkin';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: [
    'layout.organize',
    'misc.breadcrumbs',
    'misc.calendar',
    'misc.formDialog',
    'misc.tasks',
    'pages.organizeProjects',
  ],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, projectId } = ctx.params!;

  const apiClient = new BackendApiClient(ctx.req.headers);

  try {
    await apiClient.get<ZetkinProject>(
      `/api/orgs/${orgId}/campaigns/${projectId}`
    );
    return {
      props: {},
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

const ProjectCalendarPage: PageWithLayout = () => {
  const messages = useMessages(messageIds);
  const { orgId, projectId } = useNumericRouteParams();
  const { projectFuture: projectFuture } = useProject(orgId, projectId);
  const project = projectFuture.data;

  const isOnServer = useServerSide();
  if (isOnServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`${project?.title} - ${messages.layout.calendar()}`}</title>
      </Head>
      <Calendar />
    </>
  );
};

ProjectCalendarPage.getLayout = function getLayout(page) {
  return <SingleProjectLayout fixedHeight>{page}</SingleProjectLayout>;
};

export default ProjectCalendarPage;
