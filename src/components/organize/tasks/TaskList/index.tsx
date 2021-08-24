import { FormattedMessage as Msg } from 'react-intl';
import React from 'react';
import { useRouter } from 'next/router';
import { Card, Divider, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core';

import { config as createTaskAction } from 'components/ZetkinSpeedDial/actions/createTask';
import { ZetkinTask } from 'types/zetkin';
import getTaskStatus, { TASK_STATUS } from 'utils/getTaskStatus';

import TaskListItem from './TaskListItem';


interface TaskListProps {
    hrefBase: string;
    tasks: ZetkinTask[];
}

const TaskList = ({ hrefBase, tasks }: TaskListProps): JSX.Element => {
    const router = useRouter();

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
            <List>
                { tasks.length === 0 ? (
                    <ListItem button component="a" onClick={ () => {
                        router.push(`${router.asPath}#${createTaskAction.urlKey}`);
                    } }>
                        <ListItemText>
                            <Msg id="pages.organizeCampaigns.noTasksCreatePrompt" />
                        </ListItemText>
                    </ListItem>
                ) :
                    Object.entries(tasksGroupedByStatus).map(([status, tasks]) => {
                        return (
                            <List
                                key={ status }
                                disablePadding
                                subheader={
                                    <ListSubheader>
                                        <Msg id={ `misc.tasks.statuses.${status}` } />
                                    </ListSubheader>
                                }>
                                { tasks.map((task, index) => {
                                    return (
                                        <React.Fragment
                                            key={ task.id }>
                                            <TaskListItem
                                                hrefBase={ hrefBase }
                                                task={ task }
                                            />
                                            { index !== tasks.length - 1 && (
                                                <Divider />
                                            ) }
                                        </React.Fragment>
                                    );
                                }) }
                            </List>
                        );
                    })
                }
            </List>
        </Card>
    );
};

export default TaskList;
