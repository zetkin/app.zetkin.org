import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { ResponsivePie } from '@nivo/pie';
import { useRouter } from 'next/router';
import { Box, Typography } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import getOrg from 'utils/fetching/getOrg';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleTaskLayout from 'features/tasks/layouts/SingleTaskLayout';
import { taskResource } from 'features/tasks/api/tasks';
import ZetkinQuery from 'components/ZetkinQuery';
import {
  ASSIGNED_STATUS,
  ZetkinAssignedTask,
} from 'features/tasks/components/types';

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

  await ctx.queryClient.prefetchQuery(
    ['org', orgId],
    getOrg(orgId as string, ctx.apiFetch)
  );
  const orgState = ctx.queryClient.getQueryState(['org', orgId]);

  const { prefetch: prefetchTask } = taskResource(
    orgId as string,
    taskId as string
  );
  const { state: taskState, data: taskData } = await prefetchTask(ctx);

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
  const intl = useIntl();

  const { taskId, orgId } = useRouter().query;
  const { useQuery: useTaskQuery, useAssignedTasksQuery } = taskResource(
    orgId as string,
    taskId as string
  );
  const { data: task } = useTaskQuery();
  const assignedTasksQuery = useAssignedTasksQuery();

  return (
    <>
      <Head>
        <title>{`${task?.title} - ${intl.formatMessage({
          id: 'layout.organize.tasks.tabs.insights',
        })}`}</title>
      </Head>
      <>
        <ZetkinQuery queries={{ assignedTasksQuery }}>
          {({ queries }) => {
            return (
              <Box height={400} maxWidth={500} mt={3} width="100%">
                <Typography>
                  <Msg id="pages.organizeCampaigns.assigneeActions" />
                </Typography>
                <PieChart tasks={queries.assignedTasksQuery.data} />
              </Box>
            );
          }}
        </ZetkinQuery>
      </>
    </>
  );
};

TaskInsightsPage.getLayout = function getLayout(page) {
  return <SingleTaskLayout>{page}</SingleTaskLayout>;
};

export default TaskInsightsPage;
