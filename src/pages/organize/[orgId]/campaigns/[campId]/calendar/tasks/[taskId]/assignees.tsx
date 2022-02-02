import { Box } from '@material-ui/core';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import getOrg from 'fetching/getOrg';
import { PageWithLayout } from 'types';
import patchQuery from 'fetching/patchQuery';
import { QUERY_STATUS } from 'types/smartSearch';
import QueryStatusAlert from 'components/smartSearch/QueryStatusAlert';
import { scaffold } from 'utils/next';
import SingleTaskLayout from 'layout/organize/SingleTaskLayout';
import SmartSearchDialog from 'components/smartSearch/SmartSearchDialog';
import TaskAssigneesList from 'components/organize/tasks/TaskAssigneesList';
import { taskResource } from 'api/tasks';
import ZetkinQuery from 'components/ZetkinQuery';
import getTaskStatus, { TASK_STATUS } from 'utils/getTaskStatus';
import { ZetkinAssignedTask, ZetkinTask } from 'types/zetkin';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.assignees', 'misc'],
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
  }
  // we don't want 'publishing' state to appear on page load while the data is being fetched
  else if (assignedTasks && !assignedTasks.length) {
    queryStatus = QUERY_STATUS.PUBLISHED;
  }
  return queryStatus;
};

const TaskAssigneesPage: PageWithLayout = () => {
  const intl = useIntl();
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
        <title>{`${task?.title} - ${intl.formatMessage({
          id: 'layout.organize.tasks.tabs.assignees',
        })}`}</title>
      </Head>
      <>
        <QueryStatusAlert
          openDialog={() => setDialogOpen(true)}
          status={queryStatus}
        />
        <ZetkinQuery queries={{ assignedTasksQuery }}>
          {({ queries }) => {
            return (
              <Box mt={3}>
                <TaskAssigneesList
                  assignedTasks={queries.assignedTasksQuery.data}
                />
              </Box>
            );
          }}
        </ZetkinQuery>
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
