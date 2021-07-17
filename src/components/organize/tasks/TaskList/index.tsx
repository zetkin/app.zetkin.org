import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Card, List } from '@material-ui/core';

import getCampaignTasks from '../../../../fetching/tasks/getCampaignTasks';
import TaskListItem from './TaskListItem';

interface TaskListProps {
    hrefBase: string;
}

const TaskList = ({ hrefBase }: TaskListProps): JSX.Element => {
    const intl = useIntl();
    const { campId, orgId } = useRouter().query;
    const { data: tasks } = useQuery(
        ['campaignTasks', orgId, campId],
        getCampaignTasks(orgId as string, campId as string),
    );

    return (
        <Card>
            <List
                aria-label={ intl.formatMessage({ id: 'pages.organizeCampaigns.tasks' }) }>
                { tasks && tasks.map(task => (
                    <TaskListItem key={ task.id } hrefBase={ hrefBase } task={ task } />
                )) }
            </List>
        </Card>
    );
};

export default TaskList;
