import { useIntl } from 'react-intl';
import { Card, Divider, List } from '@material-ui/core';

import TaskListItem from './TaskListItem';
import { ZetkinTask } from '../../../../types/zetkin';
import getTaskStatus, { TASK_STATUS } from '../../../../utils/getTaskStatus';

const TASK_STATUS_ORDER: {[key in TASK_STATUS]: number} = {
    [TASK_STATUS.DRAFT]: 0,
    [TASK_STATUS.ACTIVE]: 1,
    [TASK_STATUS.SCHEDULED]: 2,
    [TASK_STATUS.CLOSED]: 3,
};

const sortTasksByStatus = (firstTask: ZetkinTask, secondTask: ZetkinTask): number => {
    const firstTaskStatus = getTaskStatus(firstTask);
    const secondTaskStatus = getTaskStatus(secondTask);
    return TASK_STATUS_ORDER[firstTaskStatus] - TASK_STATUS_ORDER[secondTaskStatus];
};

interface TaskListProps {
    hrefBase: string;
    tasks: ZetkinTask[];
}


const TaskList = ({ hrefBase, tasks }: TaskListProps): JSX.Element => {
    const intl = useIntl();

    const tasksOrderedByStatus = tasks.sort(sortTasksByStatus);

    return (
        <Card>
            <List
                aria-label={ intl.formatMessage({ id: 'pages.organizeCampaigns.tasks' }) }>
                { tasksOrderedByStatus.map((task, index) => (
                    <>
                        <TaskListItem key={ task.id } hrefBase={ hrefBase } task={ task } />
                        {
                            // Show divider under all items except last
                            index !== tasks.length - 1 && (
                                <Divider />
                            )
                        }
                    </>
                )) }
            </List>
        </Card>
    );
};

export default TaskList;
