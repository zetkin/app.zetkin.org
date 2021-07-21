import { GetServerSideProps } from 'next';
import { useQuery } from 'react-query';
import { Box, Container, Grid } from '@material-ui/core';

import getTask from 'fetching/tasks/getTask';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import SingleTaskLayout from 'components/layout/organize/SingleTaskLayout';
import TaskDetailsCard from 'components/organize/tasks/TaskDetailsCard';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize',
        'misc.breadcrumbs',
        'pages.organizeCampaigns',
        'misc.formDialog',
        'misc.tasks',
        'misc.speedDial',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId, campId, taskId } = ctx.params!;

    await ctx.queryClient.prefetchQuery(
        ['task', taskId],
        getTask(
            orgId as string,
            taskId as string,
            ctx.apiFetch,
        ),
    );
    const taskQueryState = ctx.queryClient.getQueryState(['task', taskId]);

    if (
        taskQueryState?.status === 'success'
    ) {
        return {
            props: {
                campId,
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

type TaskDetailPageProps = {
    campId: string;
    orgId: string;
    taskId: string;
}

const TaskDetailPage: PageWithLayout<TaskDetailPageProps> = ({ taskId, orgId }) => {
    const { data: task } = useQuery(['task', taskId], getTask(orgId, taskId));

    if (!task) return null;

    return (
        <Box mt={ 4 }>
            <Container>
                <Grid container>
                    { /* Details Card */ }
                    <Grid item xs={ 12 }>
                        <TaskDetailsCard task={ task } />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

TaskDetailPage.getLayout = function getLayout(page) {
    return (
        <SingleTaskLayout>
            { page }
        </SingleTaskLayout>
    );
};

export default TaskDetailPage;
