import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import BackendApiClient from 'core/api/client/BackendApiClient';
import getOrg from 'utils/fetching/getOrg';
import { PageWithLayout } from 'utils/types';
import patchQuery from 'utils/fetching/patchQuery';
import { QUERY_STATUS } from 'features/smartSearch/components/types';
import QueryStatusAlert from 'features/tasks/components/QueryStatusAlert';
import { scaffold } from 'utils/next';
import SingleTaskLayout from 'features/tasks/layout/SingleTaskLayout';
import SmartSearchDialog from 'features/smartSearch/components/SmartSearchDialog';
import TaskAssigneesList from 'features/tasks/components/TaskAssigneesList';
import useAssignedTasks from 'features/tasks/hooks/useAssignedTasks';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useTask from 'features/tasks/hooks/useTask';
import ZUIFuture from 'zui/ZUIFuture';
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
  const apiClient = new BackendApiClient(ctx.req.headers);
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

const getQueryStatus = (
  task: ZetkinTask | null,
  assignedTasks: ZetkinAssignedTask[] | null
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

  const { orgId, taskId } = useNumericRouteParams();
  const assignedTasksQuery = useAssignedTasks(orgId, taskId);
  const task = useTask(orgId, taskId);
  const assignedTasks = assignedTasksQuery?.data;
  const query = task?.target;

  const queryMutation = useMutation(
    patchQuery(orgId.toString(), query?.id as number),
    {
      onSettled: () =>
        queryClient.invalidateQueries(['task', taskId.toString()]),
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
      <QueryStatusAlert
        openDialog={() => setDialogOpen(true)}
        status={queryStatus}
      />
      <ZUIFuture future={assignedTasksQuery}>
        {(data) => {
          return (
            <Box mt={3}>
              <TaskAssigneesList assignedTasks={data} />
            </Box>
          );
        }}
      </ZUIFuture>
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
