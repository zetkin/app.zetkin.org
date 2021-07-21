import { FunctionComponent } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import getTask from 'fetching/tasks/getTask';
import TabbedLayout from './TabbedLayout';


const SingleCampaignLayout: FunctionComponent = ({ children }) => {
    const { taskId, orgId, campId } = useRouter().query;
    const { data: task } = useQuery(['task', taskId ], getTask(orgId  as string, taskId as string));

    return (
        <TabbedLayout
            baseHref={ `/organize/${orgId}/campaigns/${campId}/tasks/${taskId}` }
            defaultTab="/"
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
