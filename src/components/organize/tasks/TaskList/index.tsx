import { useIntl } from 'react-intl';
import { List, Typography } from '@material-ui/core';

import TaskListItem from './TaskListItem';
import { ZetkinTask } from '../../../../types/zetkin';

interface TaskListProps {
    tasks: ZetkinTask[];
    hrefBase: string;
}

const TaskList = ({ tasks, hrefBase }: TaskListProps): JSX.Element => {
    const intl = useIntl();

    return (
        <List aria-label={ intl.formatMessage({
            id: 'pages.organizeCampaigns.tasks',
        }) } disablePadding>
            { tasks.length > 0 ?
                tasks.map(task => (
                    <TaskListItem key={ task.id } hrefBase={ hrefBase } task={ task } />
                )):
                <Typography>No Tasks</Typography> }
        </List>
    );
};

export default TaskList;
