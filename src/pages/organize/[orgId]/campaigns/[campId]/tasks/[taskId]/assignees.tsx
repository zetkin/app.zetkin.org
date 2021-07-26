import { Button } from '@material-ui/core';
import { GetServerSideProps } from 'next';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import getOrg from 'fetching/getOrg';
import getTaskFilterSpec from 'fetching/tasks/getTaskFilterSpec';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import TaskAssigneesSmartSearchDialog from 'components/smartSearch/TaskAssigneesSmartSearchDialog';
import { useState } from 'react';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs', 'misc.smartSearch',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId, taskId } = ctx.params!;

    await ctx.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string, ctx.apiFetch));
    const orgState = ctx.queryClient.getQueryState(['org', orgId]);

    await ctx.queryClient.prefetchQuery(['filter_spec', orgId, taskId], getTaskFilterSpec(orgId as string, taskId as string, ctx.apiFetch));
    const filterSpecState = ctx.queryClient.getQueryState(['filter_spec', orgId, taskId]);

    if (orgState?.status === 'success' && filterSpecState?.status === 'success' ) {
        return {
            props: {
                orgId,
                taskId,
            },
        };
    }
    else {
        return {
            notFound: true,
        };
    }
}, scaffoldOptions);

const TaskAssigneesPage: PageWithLayout = () => {
    const { taskId, orgId } = useRouter().query;
    const filterSpecQuery = useQuery(['filter_spec', orgId, taskId], getTaskFilterSpec(orgId as string, taskId as string));
    const filterSpec = filterSpecQuery?.data || [];

    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDialogClose = () => setDialogOpen(false);

    return (
        <>
            <Button color="primary" onClick={ () => setDialogOpen(true) } variant="contained">
                Edit
            </Button>
            <TaskAssigneesSmartSearchDialog filterSpec={ filterSpec } onDialogClose={ handleDialogClose } open={ dialogOpen }/>
        </>
    );
};

TaskAssigneesPage.getLayout = function getLayout(page) {
    return (
        <>
            { page }
        </>
    );
};

export default TaskAssigneesPage;
