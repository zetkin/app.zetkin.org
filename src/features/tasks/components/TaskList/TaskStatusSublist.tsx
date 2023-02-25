import React from 'react';
import { List, ListSubheader } from '@mui/material';

import { Msg } from 'core/i18n';
import { TASK_STATUS } from 'features/tasks/utils/getTaskStatus';
import TaskListItem from './TaskListItem';
import { ZetkinTask } from 'utils/types/zetkin';

import messageIds from 'features/tasks/l10n/messageIds';

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
          <Msg id={messageIds.statuses[status]} />
        </ListSubheader>
      }
    >
      {tasks.map((task) => {
        return (
          <React.Fragment key={task.id}>
            <TaskListItem task={task} />
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default TaskStatusSublist;
