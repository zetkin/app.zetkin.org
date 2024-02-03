import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { ResponsivePie } from '@nivo/pie';
import { Box, Typography } from '@mui/material';

import BackendApiClient from 'core/api/client/BackendApiClient';
import messageIds from 'features/campaigns/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleTaskLayout from 'features/tasks/layout/SingleTaskLayout';
import useAssignedTasks from 'features/tasks/hooks/useAssignedTasks';
import { useNumericRouteParams } from 'core/hooks';
import useTask from 'features/tasks/hooks/useTask';
import ZUIFuture from 'zui/ZUIFuture';
import {
  ASSIGNED_STATUS,
  ZetkinAssignedTask,
  ZetkinTask,
} from 'features/tasks/components/types';
import { Msg, useMessages } from 'core/i18n';

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
  const assignedTasksQuery = useAssignedTasks(orgId, taskId);
  const task = useTask(orgId, taskId);

  return (
    <>
      <Head>
        <title>{`${task?.title} - ${messages.taskLayout.tabs.insights}`}</title>
      </Head>
      <ZUIFuture future={assignedTasksQuery}>
        {(data) => {
          return (
            <Box height={400} maxWidth={500} mt={3} width="100%">
              <Typography>
                <Msg id={messageIds.assigneeActions} />
              </Typography>
              <PieChart tasks={data} />
            </Box>
          );
        }}
      </ZUIFuture>
    </>
  );
};

TaskInsightsPage.getLayout = function getLayout(page) {
  return <SingleTaskLayout>{page}</SingleTaskLayout>;
};

export default TaskInsightsPage;
