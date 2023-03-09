import { useRouter } from 'next/router';
import { Card, Divider, List, ListItem, ListItemText } from '@mui/material';
import React, { useState } from 'react';

import { config as createTaskAction } from 'zui/ZUISpeedDial/actions/createTask';
import { Msg } from 'core/i18n';
import TaskStatusSublist from './TaskStatusSublist';
import { ZetkinTask } from 'utils/types/zetkin';
import getTaskStatus, { TASK_STATUS } from 'features/tasks/utils/getTaskStatus';

import messageIds from 'features/tasks/l10n/messageIds';

interface TaskListProps {
  tasks: ZetkinTask[];
}

const TaskList: React.FunctionComponent<TaskListProps> = ({ tasks }) => {
  const router = useRouter();
  const [showExpiredTasks, setShowExpiredTasks] = useState(false);

  const tasksGroupedByStatus = tasks.reduce((acc, task) => {
    const taskStatus = getTaskStatus(task);
    if (taskStatus in acc) {
      return { ...acc, [taskStatus]: [...acc[taskStatus], task] };
    } else {
      return { ...acc, [taskStatus]: [task] };
    }
  }, {} as { [key in TASK_STATUS]: ZetkinTask[] });

  return (
    <Card>
      <List disablePadding>
        {tasks.length === 0 && ( // If no tasks, show button to create a new one
          <ListItem
            button
            component="a"
            onClick={() => {
              router.push(`${router.asPath}#${createTaskAction.urlKey}`);
            }}
          >
            <ListItemText>
              <Msg id={messageIds.noTasksCreatePrompt} />
            </ListItemText>
          </ListItem>
        )}

        {TASK_STATUS.DRAFT in tasksGroupedByStatus && (
          <TaskStatusSublist
            status={TASK_STATUS.DRAFT}
            tasks={tasksGroupedByStatus[TASK_STATUS.DRAFT]}
          />
        )}

        {TASK_STATUS.SCHEDULED in tasksGroupedByStatus && (
          <TaskStatusSublist
            status={TASK_STATUS.SCHEDULED}
            tasks={tasksGroupedByStatus[TASK_STATUS.SCHEDULED]}
          />
        )}

        {TASK_STATUS.ACTIVE in tasksGroupedByStatus && (
          <TaskStatusSublist
            status={TASK_STATUS.ACTIVE}
            tasks={tasksGroupedByStatus[TASK_STATUS.ACTIVE]}
          />
        )}

        {TASK_STATUS.CLOSED in tasksGroupedByStatus && (
          <TaskStatusSublist
            status={TASK_STATUS.CLOSED}
            tasks={tasksGroupedByStatus[TASK_STATUS.CLOSED]}
          />
        )}

        {showExpiredTasks && TASK_STATUS.EXPIRED in tasksGroupedByStatus && (
          <>
            {TASK_STATUS.EXPIRED in tasksGroupedByStatus && (
              <TaskStatusSublist
                status={TASK_STATUS.EXPIRED}
                tasks={tasksGroupedByStatus[TASK_STATUS.EXPIRED]}
              />
            )}
          </>
        )}

        {!showExpiredTasks && TASK_STATUS.EXPIRED in tasksGroupedByStatus && (
          <>
            <Divider />
            <ListItem
              button
              component="a"
              onClick={() => setShowExpiredTasks(true)}
            >
              <ListItemText>
                <Msg id={messageIds.showExpiredTasksPrompt} />
              </ListItemText>
            </ListItem>
          </>
        )}
      </List>
    </Card>
  );
};

export default TaskList;
