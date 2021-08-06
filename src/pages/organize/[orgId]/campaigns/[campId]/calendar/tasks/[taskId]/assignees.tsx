import { GetServerSideProps } from 'next';
import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Box, Link , Typography } from '@material-ui/core';

import getOrg from 'fetching/getOrg';
import getTask from 'fetching/tasks/getTask';
import getTaskAssignments from 'fetching/tasks/getTaskAssignments';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import SingleTaskLayout from 'components/layout/organize/SingleTaskLayout';
import SmartSearchDialog from 'components/smartSearch/SmartSearchDialog';
import { useState } from 'react';
import { ZetkinTask } from 'types/zetkin';
import getTaskStatus, { TASK_STATUS } from 'utils/getTaskStatus';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs', 'misc.smartSearch', 'pages.assignees', 'misc.tasks',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { campId, orgId, taskId } = ctx.params!;

    await ctx.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string, ctx.apiFetch));
    const orgState = ctx.queryClient.getQueryState(['org', orgId]);

    await ctx.queryClient.prefetchQuery(['task', orgId, taskId], getTask(orgId as string, taskId as string, ctx.apiFetch));
    const taskState = ctx.queryClient.getQueryState(['task', orgId, taskId]);
    const taskData: ZetkinTask | undefined = ctx.queryClient.getQueryData(['task', orgId, taskId]);

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
    EDITABLE='editable',
    PUBLISHED='published',
    PUBLISHING='publishing',
}

const TaskAssigneesPage: PageWithLayout = () => {
    const { taskId, orgId } = useRouter().query;
    const taskQuery = useQuery(['task', orgId, taskId], getTask(orgId as string, taskId as string));
    const assignmentsQuery = useQuery(['assignments', orgId, taskId], getTaskAssignments(
        orgId as string, taskId as string,
    ));
    const task = taskQuery?.data;
    const assignments = assignmentsQuery?.data;
    const query = task?.target;

    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDialogClose = () => setDialogOpen(false);

    const taskStatus = task ? getTaskStatus(task) : undefined;

    const getQueryStatus = () => {
        let queryStatus = QUERY_STATUS.PUBLISHED;
        if (taskStatus === TASK_STATUS.DRAFT || taskStatus === TASK_STATUS.SCHEDULED) {
            queryStatus = QUERY_STATUS.EDITABLE;
        }
        // we don't want 'publishing' state to appear on page load while the data is being fetched
        else if (assignments && !assignments.length) {
            queryStatus = QUERY_STATUS.PUBLISHING;
        }
        return queryStatus;
    };

    const queryStatus = getQueryStatus();

    const readOnly = queryStatus === QUERY_STATUS.PUBLISHING ||
        queryStatus === QUERY_STATUS.PUBLISHED;

    return (
        <>
            <Box p={ 2 }>
                <Alert severity={
                    queryStatus === QUERY_STATUS.EDITABLE ?
                        'warning' : queryStatus === QUERY_STATUS.PUBLISHING ?
                            'info' : 'success' }>
                    <AlertTitle>
                        <Msg id={ `pages.assignees.taskStates.${queryStatus}` }/>
                    </AlertTitle>
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
                    </Link>
                </Alert>
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
