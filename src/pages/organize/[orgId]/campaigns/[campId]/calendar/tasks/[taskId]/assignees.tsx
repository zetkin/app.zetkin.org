import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import getOrg from 'utils/fetching/getOrg';
import { PageWithLayout } from 'utils/types';
import patchQuery from 'utils/fetching/patchQuery';
import { QUERY_STATUS } from 'features/smartSearch/components/types';
import QueryStatusAlert from 'features/tasks/components/QueryStatusAlert';
import { scaffold } from 'utils/next';
import SingleTaskLayout from 'features/tasks/layout/SingleTaskLayout';
import SmartSearchDialog from 'features/smartSearch/components/SmartSearchDialog';
import TaskAssigneesList from 'features/tasks/components/TaskAssigneesList';
import { taskResource } from 'features/tasks/api/tasks';
import { useMessages } from 'core/i18n';
import ZUIQuery from 'zui/ZUIQuery';
import getTaskStatus, { TASK_STATUS } from 'features/tasks/utils/getTaskStatus';
import { ZetkinAssignedTask, ZetkinTask } from 'utils/types/zetkin';

import messageIds from 'features/campaigns/l10n/messageIds';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.assignees'],
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

const getQueryStatus = (
  task?: ZetkinTask,
  assignedTasks?: ZetkinAssignedTask[]
) => {
  const taskStatus = task ? getTaskStatus(task) : undefined;
  let queryStatus = QUERY_STATUS.ASSIGNED;
  if (
    taskStatus === TASK_STATUS.DRAFT ||
    taskStatus === TASK_STATUS.SCHEDULED
  ) {
    queryStatus = QUERY_STATUS.EDITABLE;
    if (!task?.target.filter_spec.length) {
      queryStatus = QUERY_STATUS.NEW;
    }
  } else if (assignedTasks && !assignedTasks.length) {
    // we don't want 'publishing' state to appear on page load while the data is being fetched
    queryStatus = QUERY_STATUS.PUBLISHED;
  }
  return queryStatus;
};

const TaskAssigneesPage: PageWithLayout = () => {
  const messages = useMessages(messageIds);
  const queryClient = useQueryClient();

  const { taskId, orgId } = useRouter().query;
  const { useQuery: useTaskQuery, useAssignedTasksQuery } = taskResource(
    orgId as string,
    taskId as string
  );
  const { data: task } = useTaskQuery();
  const assignedTasksQuery = useAssignedTasksQuery();
  const assignedTasks = assignedTasksQuery?.data;
  const query = task?.target;

  const queryMutation = useMutation(
    patchQuery(orgId as string, query?.id as number),
    {
      onSettled: () => queryClient.invalidateQueries(['task', taskId]),
    }
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogClose = () => setDialogOpen(false);

  const queryStatus = getQueryStatus(task, assignedTasks);

  const readOnly =
    queryStatus === QUERY_STATUS.PUBLISHED ||
    queryStatus === QUERY_STATUS.ASSIGNED;

  return (
    <>
      <Head>
        <title>
          {`${task?.title} - ${messages.taskLayout.tabs.assignees()}`}
        </title>
      </Head>
      <>
        <QueryStatusAlert
          openDialog={() => setDialogOpen(true)}
          status={queryStatus}
        />
        <ZUIQuery queries={{ assignedTasksQuery }}>
          {({ queries }) => {
            return (
              <Box mt={3}>
                <TaskAssigneesList
                  assignedTasks={queries.assignedTasksQuery.data}
                />
              </Box>
            );
          }}
        </ZUIQuery>
      </>
      {dialogOpen && (
        <SmartSearchDialog
          onDialogClose={handleDialogClose}
          onSave={(query) => {
            queryMutation.mutate(query);
            setDialogOpen(false);
          }}
          query={query}
          readOnly={readOnly}
        />
      )}
    </>
  );
};

TaskAssigneesPage.getLayout = function getLayout(page) {
  return <SingleTaskLayout>{page}</SingleTaskLayout>;
};

export default TaskAssigneesPage;
