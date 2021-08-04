import { Button } from '@material-ui/core';
import { GetServerSideProps } from 'next';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import getOrg from 'fetching/getOrg';
import getTask from 'fetching/tasks/getTask';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import SmartSearchDialog from 'components/smartSearch/SmartSearchDialog';
import { useState } from 'react';
import { ZetkinTask } from 'types/zetkin';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs', 'misc.smartSearch',
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

const TaskAssigneesPage: PageWithLayout = () => {
    const { taskId, orgId } = useRouter().query;
    const taskQuery = useQuery(['task', orgId, taskId], getTask(orgId as string, taskId as string));
    const task = taskQuery?.data;

    const query = task?.target;

    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDialogClose = () => setDialogOpen(false);

    return (
        <>
            <Button color="primary" onClick={ () => setDialogOpen(true) } variant="contained">
                Edit
            </Button>
            { dialogOpen &&
            <SmartSearchDialog onDialogClose={ handleDialogClose } query={ query }/> }
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
