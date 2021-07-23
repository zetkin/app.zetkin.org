import { FunctionComponent } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import getTask from 'fetching/tasks/getTask';
import TabbedLayout from './TabbedLayout';

import TaskStatusText from 'components/organize/tasks/TaskStatusText';


const SingleCampaignLayout: FunctionComponent = ({ children }) => {
    const { taskId, orgId, campId } = useRouter().query;
    const { data: task } = useQuery(['task', taskId ], getTask(orgId  as string, taskId as string));

    if (!task) return null;

    return (
        <TabbedLayout
            baseHref={ `/organize/${orgId}/campaigns/${campId}/calendar/tasks/${taskId}` }
            defaultTab="/"
            subtitle={
                <TaskStatusText task={ task } />
            }
            tabs={ [
                { href: `/`, messageId: 'layout.organize.tasks.tabs.summary' },
                { href: `/assignees`, messageId: 'layout.organize.tasks.tabs.assignees' },
            ] }
            title={ task?.title }>
            { children }
        </TabbedLayout>
    );
};

export default SingleCampaignLayout;
