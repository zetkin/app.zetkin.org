import { AlertTitle } from '@material-ui/lab';
import { GetServerSideProps } from 'next';
import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import ZetkinAlert from 'components/ZetkinAlert';
import { Box, Button , Link, Typography } from '@material-ui/core';

import getAssignedTasks from 'fetching/tasks/getAssignedTasks';
import getOrg from 'fetching/getOrg';
import getTask from 'fetching/tasks/getTask';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import SingleTaskLayout from 'components/layout/organize/SingleTaskLayout';
import SmartSearchDialog from 'components/smartSearch/SmartSearchDialog';
import TaskAssigneesList from 'components/organize/tasks/TaskAssigneesList';
import { useState } from 'react';
import getTaskStatus, { TASK_STATUS } from 'utils/getTaskStatus';
import { ZetkinAssignedTask, ZetkinTask } from 'types/zetkin';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs', 'misc.smartSearch', 'pages.assignees', 'misc.tasks', 'misc.formDialog',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { campId, orgId, taskId } = ctx.params!;

    await ctx.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string, ctx.apiFetch));
    const orgState = ctx.queryClient.getQueryState(['org', orgId]);

    await ctx.queryClient.prefetchQuery(['task', taskId], getTask(orgId as string, taskId as string, ctx.apiFetch));
    const taskState = ctx.queryClient.getQueryState(['task', taskId]);
    const taskData: ZetkinTask | undefined = ctx.queryClient.getQueryData(['task', taskId]);

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

enum QUERY_STATUS {
    ERROR='error', // no smart search query created yet
    EDITABLE='editable', // draft or scheduled task
    PUBLISHED='published', // published but not yet assigned
    ASSIGNED='assigned', // published and assigned
}

const getQueryStatus = (
    task?: ZetkinTask,
    assignedTasks?: ZetkinAssignedTask[]) => {
    const taskStatus = task ? getTaskStatus(task) : undefined;
    let queryStatus = QUERY_STATUS.ASSIGNED;
    if (taskStatus === TASK_STATUS.DRAFT || taskStatus === TASK_STATUS.SCHEDULED) {
        queryStatus = QUERY_STATUS.EDITABLE;
        if (!task?.target.filter_spec.length) {
            queryStatus = QUERY_STATUS.ERROR;
        }
    }
    // we don't want 'publishing' state to appear on page load while the data is being fetched
    else if (assignedTasks && !assignedTasks.length) {
        queryStatus = QUERY_STATUS.PUBLISHED;
    }
    return queryStatus;
};

const TaskAssigneesPage: PageWithLayout = () => {
    const { taskId, orgId } = useRouter().query;
    const taskQuery = useQuery(['task', taskId], getTask(orgId as string, taskId as string));
    const assignedTasksQuery = useQuery(['assignedTasks', orgId, taskId], getAssignedTasks(
        orgId as string, taskId as string,
    ));
    const task = taskQuery?.data;
    const assignedTasks = assignedTasksQuery?.data;
    const query = task?.target;

    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDialogClose = () => setDialogOpen(false);

    const queryStatus = getQueryStatus(task, assignedTasks);

    const readOnly = queryStatus === QUERY_STATUS.PUBLISHED ||
        queryStatus === QUERY_STATUS.ASSIGNED;

    return (
        <>
            <Box p={ 2 }>
                <ZetkinAlert
                    alertSeverity={
                        queryStatus ===  QUERY_STATUS.ERROR ?
                            'error' : queryStatus === QUERY_STATUS.EDITABLE ?
                                'warning' : queryStatus === QUERY_STATUS.PUBLISHED ?
                                    'info' : 'success' }>
                    <AlertTitle>
                        <Msg id={ `pages.assignees.queryStates.${queryStatus}` }/>
                    </AlertTitle>
                    { queryStatus !== QUERY_STATUS.ERROR &&
                    <Link
                        color="inherit"
                        component="button"
                        onClick={ () => setDialogOpen(true) }
                        underline="always">
                        <Typography align="left">
                            { readOnly ?
                                <Msg id="pages.assignees.links.readOnly"/> :
                                <Msg id="pages.assignees.links.edit"/>
                            }
                        </Typography>
                    </Link> }
                    { queryStatus === QUERY_STATUS.ERROR &&
                    <Button
                        color="primary"
                        onClick={ () => setDialogOpen(true) }
                        variant="contained">
                        <Msg id="pages.assignees.links.create" />
                    </Button>
                    }
                </ZetkinAlert>

                { assignedTasks && (
                    <Box mt={ 3 }>
                        <TaskAssigneesList assignedTasks={ assignedTasks } />
                    </Box>
                ) }
            </Box>
            { dialogOpen &&
            <SmartSearchDialog
                onDialogClose={ handleDialogClose }
                query={ query }
                readOnly={ readOnly }
            /> }
        </>
    );
};

TaskAssigneesPage.getLayout = function getLayout(page) {
    return (
        <SingleTaskLayout>
            { page }
        </SingleTaskLayout>
    );
};

export default TaskAssigneesPage;
