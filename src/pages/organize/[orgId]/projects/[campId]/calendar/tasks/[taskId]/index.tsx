import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';
import Head from 'next/head';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleTaskLayout from 'features/tasks/layout/SingleTaskLayout';
import TaskDetailsSection from 'features/tasks/components/TaskDetailsSection';
import TaskPreviewSection from 'features/tasks/components/TaskPreviewSection';
import { taskResource } from 'features/tasks/api/tasks';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.organizeCampaigns'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, taskId } = ctx.params!;
  const apiClient = new BackendApiClient(ctx.req.headers);

  await ctx.queryClient.prefetchQuery(['tasks', orgId, taskId], async () => {
    return await apiClient.get(`/api/orgs/${orgId}/tasks/${taskId}`);
  });
  const taskQueryState = ctx.queryClient.getQueryState([
    'tasks',
    orgId,
    taskId,
  ]);

  if (taskQueryState?.status === 'success') {
    return {
      props: {
        campId,
        orgId,
        taskId,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

type TaskDetailPageProps = {
  campId: string;
  orgId: string;
  taskId: string;
};

const TaskDetailPage: PageWithLayout<TaskDetailPageProps> = ({
  taskId,
  orgId,
}) => {
  const { data: task } = taskResource(orgId, taskId).useQuery();

  if (!task) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{task?.title}</title>
      </Head>
      <Grid container justifyContent="space-between" spacing={4}>
        <Grid item lg={6} md={6} sm={12}>
          <TaskDetailsSection task={task} />
        </Grid>
        <Grid item lg={4} md={6} sm={12}>
          <TaskPreviewSection task={task} />
        </Grid>
      </Grid>
    </>
  );
};

TaskDetailPage.getLayout = function getLayout(page) {
  return <SingleTaskLayout>{page}</SingleTaskLayout>;
};

export default TaskDetailPage;
