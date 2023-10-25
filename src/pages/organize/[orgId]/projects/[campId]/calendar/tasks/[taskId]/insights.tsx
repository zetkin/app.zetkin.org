import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { ResponsivePie } from '@nivo/pie';
import { Box, Typography } from '@mui/material';

import BackendApiClient from 'core/api/client/BackendApiClient';
import getOrg from 'utils/fetching/getOrg';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleTaskLayout from 'features/tasks/layout/SingleTaskLayout';
import { taskResource } from 'features/tasks/api/tasks';
import { useNumericRouteParams } from 'core/hooks';
import useTask from 'features/tasks/hooks/useTask';
import ZUIQuery from 'zui/ZUIQuery';
import {
  ASSIGNED_STATUS,
  ZetkinAssignedTask,
  ZetkinTask,
} from 'features/tasks/components/types';
import { Msg, useMessages } from 'core/i18n';

import messageIds from 'features/campaigns/l10n/messageIds';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: [
    'layout.organize',
    'pages.assignees',
    'pages.organizeCampaigns',
  ],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { campId, orgId, taskId } = ctx.params!;
  const apiClient = new BackendApiClient(ctx.req.headers);

  await ctx.queryClient.prefetchQuery(
    ['org', orgId],
    getOrg(orgId as string, ctx.apiFetch)
  );
  const orgState = ctx.queryClient.getQueryState(['org', orgId]);

  await ctx.queryClient.prefetchQuery(['tasks', orgId, taskId], async () => {
    return await apiClient.get(`/api/orgs/${orgId}/tasks/${taskId}`);
  });
  const taskState = ctx.queryClient.getQueryState(['tasks', orgId, taskId]);
  const taskData = ctx.queryClient.getQueryData<ZetkinTask>([
    'tasks',
    orgId,
    taskId,
  ]);

  if (orgState?.status === 'success' && taskState?.status === 'success') {
    if (campId && +campId === taskData?.campaign.id) {
      return {
        props: {
          campId,
          orgId,
          taskId,
        },
      };
    }
  }
  return {
    notFound: true,
  };
}, scaffoldOptions);

interface PieChartProps {
  tasks: ZetkinAssignedTask[];
}

const PieChart: FunctionComponent<PieChartProps> = ({ tasks }) => {
  const assigned = tasks.filter(
    (task) => task.status === ASSIGNED_STATUS.ASSIGNED
  );
  const ignored = tasks.filter(
    (task) => task.status === ASSIGNED_STATUS.IGNORED
  );
  const completed = tasks.filter(
    (task) => task.status === ASSIGNED_STATUS.COMPLETED
  );

  const data = [
    {
      color: 'rgb(255, 128, 0)',
      id: 'assigned',
      label: 'No action',
      value: assigned.length,
    },
    {
      color: 'rgb(128, 0, 255)',
      id: 'ignored',
      label: 'Discarded',
      value: ignored.length,
    },
    {
      color: 'rgb(0, 255, 128)',
      id: 'completed',
      label: 'Completed',
      value: completed.length,
    },
  ];

  return (
    <ResponsivePie
      activeOuterRadiusOffset={8}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: 'color',
        modifiers: [['darker', 2]],
      }}
      arcLinkLabel="label"
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 0.2]],
      }}
      borderWidth={1}
      cornerRadius={3}
      data={data}
      innerRadius={0.5}
      legends={[
        {
          anchor: 'bottom',
          direction: 'row',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: '#000',
              },
            },
          ],
          itemDirection: 'left-to-right',
          itemHeight: 18,
          itemOpacity: 1,
          itemTextColor: '#999',
          itemWidth: 100,
          itemsSpacing: 0,
          justify: false,
          symbolShape: 'circle',
          symbolSize: 18,
          translateX: 0,
          translateY: 56,
        },
      ]}
      margin={{ bottom: 80, left: 80, right: 80, top: 40 }}
      padAngle={0.7}
    />
  );
};

const TaskInsightsPage: PageWithLayout = () => {
  const messages = useMessages(messageIds);

  const { orgId, taskId } = useNumericRouteParams();
  const { useAssignedTasksQuery } = taskResource(
    orgId.toString(),
    taskId.toString()
  );
  const task = useTask(orgId, taskId);
  const assignedTasksQuery = useAssignedTasksQuery();

  return (
    <>
      <Head>
        <title>{`${task?.title} - ${messages.taskLayout.tabs.insights}`}</title>
      </Head>
      <>
        <ZUIQuery queries={{ assignedTasksQuery }}>
          {({ queries }) => {
            return (
              <Box height={400} maxWidth={500} mt={3} width="100%">
                <Typography>
                  <Msg id={messageIds.assigneeActions} />
                </Typography>
                <PieChart tasks={queries.assignedTasksQuery.data} />
              </Box>
            );
          }}
        </ZUIQuery>
      </>
    </>
  );
};

TaskInsightsPage.getLayout = function getLayout(page) {
  return <SingleTaskLayout>{page}</SingleTaskLayout>;
};

export default TaskInsightsPage;
