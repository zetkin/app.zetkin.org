import { FormattedMessage as Msg } from 'react-intl';
import React from 'react';
import { List, ListSubheader } from '@material-ui/core';

import { TASK_STATUS } from 'utils/getTaskStatus';
import TaskListItem from './TaskListItem';
import { ZetkinTask } from 'types/zetkin';

interface TaskStatusSublistProps {
    status: TASK_STATUS;
    tasks: ZetkinTask[];
}

const TaskStatusSublist: React.FunctionComponent<TaskStatusSublistProps> = ({
    tasks,
    status,
}) => {
    return (
        <List
            disablePadding
            subheader={
                <ListSubheader>
                    <Msg id={ `misc.tasks.statuses.${status}` } />
                </ListSubheader>
            }>
            { tasks.map((task) => {
                return (
                    <React.Fragment
                        key={ task.id }>
                        <TaskListItem
                            task={ task }
                        />
                    </React.Fragment>
                );
            }) }
        </List>
    );
};

export default TaskStatusSublist;
