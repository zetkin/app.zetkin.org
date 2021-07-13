import { List } from '@material-ui/core';
import { useIntl } from 'react-intl';

import TaskListItem from './TaskListItem';
import { ZetkinTask } from '../../../../types/zetkin';

interface TaskListProps {
    tasks: ZetkinTask[];
    hrefBase: string;
}

const TaskList = ({ tasks, hrefBase }: TaskListProps): JSX.Element => {
    const intl = useIntl();

    return (
        <List
            aria-label={ intl.formatMessage({ id: 'pages.organizeCampaigns.tasks' }) }
            disablePadding>
            { tasks.map(task => (
                <TaskListItem key={ task.id } hrefBase={ hrefBase } task={ task } />
            )) }
        </List>
    );
};

export default TaskList;
