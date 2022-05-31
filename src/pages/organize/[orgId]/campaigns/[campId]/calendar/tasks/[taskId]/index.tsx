import { GetServerSideProps } from 'next';
import { Grid } from '@material-ui/core';
import Head from 'next/head';

import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import SingleTaskLayout from 'layout/organize/SingleTaskLayout';
import TaskDetailsSection from 'components/organize/tasks/TaskDetailsSection';
import TaskPreviewSection from 'components/organize/tasks/TaskPreviewSection';
import { taskResource } from 'api/tasks';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.organizeCampaigns'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, taskId } = ctx.params!;

  const { prefetch } = taskResource(orgId as string, taskId as string);
  const { state: taskQueryState } = await prefetch(ctx);

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
      <Grid container>
        <Grid item lg={8} md={6} sm={12}>
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
