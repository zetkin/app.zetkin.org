import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';
import Head from 'next/head';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleTaskLayout from 'features/tasks/layout/SingleTaskLayout';
import TaskDetailsSection from 'features/tasks/components/TaskDetailsSection';
import TaskPreviewSection from 'features/tasks/components/TaskPreviewSection';
import useTask from 'features/tasks/hooks/useTask';
import { ZetkinTask } from 'utils/types/zetkin';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.organizeCampaigns'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, taskId } = ctx.params!;
  const apiClient = new BackendApiClient(ctx.req.headers);

  try {
    const task = await apiClient.get<ZetkinTask>(
      `/api/orgs/${orgId}/tasks/${taskId}`
    );
    if (
      parseInt(campId as string) == task.campaign.id &&
      parseInt(orgId as string) == task.organization.id
    ) {
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
  } catch (err) {
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
  const task = useTask(parseInt(orgId), parseInt(taskId));

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
