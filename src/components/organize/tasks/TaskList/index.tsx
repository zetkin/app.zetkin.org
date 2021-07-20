import React from 'react';
import { useRouter } from 'next/router';
import { Card, Divider, List, ListItem, ListItemText } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import { config as createTaskAction } from 'components/ZetkinSpeedDial/actions/createTask';
import { ZetkinTask } from 'types/zetkin';
import getTaskStatus, { TASK_STATUS } from 'utils/getTaskStatus';

import TaskListItem from './TaskListItem';

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
    const router = useRouter();

    const tasksOrderedByStatus = [...tasks].sort(sortTasksByStatus);

    return (
        <Card>
            <List
                aria-label={ intl.formatMessage({ id: 'pages.organizeCampaigns.tasks' }) }
                disablePadding>
                { tasks.length === 0 && (
                    <ListItem button component="a" onClick={ () => {
                        router.push(`${router.asPath}#${createTaskAction.urlKey}`);
                    } }>
                        <ListItemText>
                            <Msg id="pages.organizeCampaigns.noTasksCreatePrompt" />
                        </ListItemText>
                    </ListItem>
                ) }
                { tasksOrderedByStatus.map((task, index) => (
                    <React.Fragment key={ index }>
                        <TaskListItem key={ task.id } hrefBase={ hrefBase } task={ task } />
                        {
                            // Show divider under all items except last
                            index !== tasks.length - 1 && (
                                <Divider />
                            )
                        }
                    </React.Fragment>
                )) }
            </List>
        </Card>
    );
};

export default TaskList;
