import { FormattedMessage as Msg } from 'react-intl';
import { useRouter } from 'next/router';
import { Card, Divider, List, ListItem, ListItemText } from '@mui/material';
import React, { useState } from 'react';

import { config as createTaskAction } from 'components/ZetkinSpeedDial/actions/createTask';
import { ZetkinTask } from 'types/zetkin';
import getTaskStatus, { TASK_STATUS } from 'utils/getTaskStatus';

import TaskStatusSublist from './TaskStatusSublist';

interface TaskListProps {
    tasks: ZetkinTask[];
}

const TaskList: React.FunctionComponent<TaskListProps> = ({ tasks }) => {
    const router = useRouter();
    const [showClosedTasks, setShowClosedTasks] = useState(false);

    const tasksGroupedByStatus = tasks.reduce((acc, task) => {
        const taskStatus = getTaskStatus(task);
        if (taskStatus in acc) {
            return { ...acc, [taskStatus]: [...acc[taskStatus], task] };
        }
        else {
            return { ...acc, [taskStatus]: [task] };
        }
    }, {} as {[key in TASK_STATUS]: ZetkinTask[]});

    return (
        <Card>
            <List disablePadding>
                { tasks.length === 0 && ( // If no tasks, show button to create a new one
                    <ListItem button component="a" onClick={ () => {
                        router.push(`${router.asPath}#${createTaskAction.urlKey}`);
                    } }>
                        <ListItemText>
                            <Msg id="pages.organizeCampaigns.noTasksCreatePrompt" />
                        </ListItemText>
                    </ListItem>
                ) }

                {
                    TASK_STATUS.DRAFT in tasksGroupedByStatus && (
                        <TaskStatusSublist
                            status={ TASK_STATUS.DRAFT }
                            tasks={ tasksGroupedByStatus[TASK_STATUS.DRAFT] }
                        />
                    )
                }

                {
                    TASK_STATUS.SCHEDULED in tasksGroupedByStatus && (
                        <TaskStatusSublist
                            status={ TASK_STATUS.SCHEDULED }
                            tasks={ tasksGroupedByStatus[TASK_STATUS.SCHEDULED] }
                        />
                    )
                }

                {
                    TASK_STATUS.ACTIVE in tasksGroupedByStatus && (
                        <TaskStatusSublist
                            status={ TASK_STATUS.ACTIVE }
                            tasks={ tasksGroupedByStatus[TASK_STATUS.ACTIVE] }
                        />
                    )
                }

                {
                    showClosedTasks && (
                        TASK_STATUS.CLOSED in tasksGroupedByStatus ||
                        TASK_STATUS.EXPIRED in tasksGroupedByStatus
                    ) && (
                        <>
                            {
                                TASK_STATUS.CLOSED in tasksGroupedByStatus && (
                                    <TaskStatusSublist
                                        status={ TASK_STATUS.CLOSED }
                                        tasks={ tasksGroupedByStatus[TASK_STATUS.CLOSED] }
                                    />
                                )
                            }
                            {
                                TASK_STATUS.EXPIRED in tasksGroupedByStatus && (
                                    <TaskStatusSublist
                                        status={ TASK_STATUS.EXPIRED }
                                        tasks={ tasksGroupedByStatus[TASK_STATUS.EXPIRED] }
                                    />
                                )
                            }
                        </>
                    )
                }

                {
                    !showClosedTasks && (
                        TASK_STATUS.CLOSED in tasksGroupedByStatus ||
                        TASK_STATUS.EXPIRED in tasksGroupedByStatus
                    ) && (
                        <>
                            <Divider />
                            <ListItem button component="a" onClick={ () => setShowClosedTasks(true) }>
                                <ListItemText>
                                    <Msg id="pages.organizeCampaigns.showClosedTasksPrompt" />
                                </ListItemText>
                            </ListItem>
                        </>
                    )
                }
            </List>
        </Card>
    );
};

export default TaskList;
