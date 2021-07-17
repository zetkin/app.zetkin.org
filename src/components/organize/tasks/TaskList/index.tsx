import { useIntl } from 'react-intl';
import { Card, List } from '@material-ui/core';

import TaskListItem from './TaskListItem';
import { ZetkinTask } from '../../../../types/zetkin';


interface TaskListProps {
    tasks: ZetkinTask[];
    hrefBase: string;
}

const TaskList = ({ tasks, hrefBase }: TaskListProps): JSX.Element => {
    const intl = useIntl();

    // Sort tasks by status

    return (
        <Card>
            <List
                aria-label={ intl.formatMessage({ id: 'pages.organizeCampaigns.tasks' }) }>
                { tasks.map(task => (
                    <TaskListItem key={ task.id } hrefBase={ hrefBase } task={ task } />
                )) }
            </List>
        </Card>
    );
};

export default TaskList;
