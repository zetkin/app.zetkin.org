import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import SingleTaskLayout from 'layout/organize/SingleTaskLayout';
import TaskDetailsSection from 'components/organize/tasks/TaskDetailsSection';
import { taskResource } from 'api/tasks';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize',
        'pages.organizeCampaigns',
        'misc',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId, campId, taskId } = ctx.params!;

    const { prefetch } = taskResource(orgId as string, campId as string, taskId as string);
    const { state: taskQueryState } = await prefetch(ctx);

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

const TaskDetailPage: PageWithLayout<TaskDetailPageProps> = ({ taskId, campId, orgId }) => {
    const { data: task } = taskResource(orgId, campId, taskId).useQuery();

    if (!task) return null;

    return (
        <>
            <Head>
                <title>{ task?.title }</title>
            </Head>
            <TaskDetailsSection task={ task } />
        </>
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
