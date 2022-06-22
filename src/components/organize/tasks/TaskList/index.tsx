import { FormattedMessage as Msg } from 'react-intl';
import { useRouter } from 'next/router';
import { Card, Divider, List, ListItem, ListItemText } from '@material-ui/core';
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
              <Msg id="pages.organizeCampaigns.noTasksCreatePrompt" />
            </ListItemText>
          </ListItem>
        )}

        {renderTaskList(TASK_STATUS.DRAFT)}
        {renderTaskList(TASK_STATUS.SCHEDULED)}
        {renderTaskList(TASK_STATUS.ACTIVE)}
        {renderTaskList(TASK_STATUS.PASSED)}

        {showClosedTasks &&
          (TASK_STATUS.CLOSED in tasksGroupedByStatus ||
            TASK_STATUS.EXPIRED in tasksGroupedByStatus) && (
            <>
              {renderTaskList(TASK_STATUS.CLOSED)}
              {renderTaskList(TASK_STATUS.EXPIRED)}
            </>
          )}

        {!showClosedTasks &&
          (TASK_STATUS.CLOSED in tasksGroupedByStatus ||
            TASK_STATUS.EXPIRED in tasksGroupedByStatus) && (
            <>
              <Divider />
              <ListItem
                button
                component="a"
                onClick={() => setShowClosedTasks(true)}
              >
                <ListItemText>
                  <Msg id="pages.organizeCampaigns.showClosedTasksPrompt" />
                </ListItemText>
              </ListItem>
            </>
          )}
      </List>
    </Card>
  );

  function renderTaskList(status: TASK_STATUS) {
    return (
      status in tasksGroupedByStatus && (
        <TaskStatusSublist
          status={status}
          tasks={tasksGroupedByStatus[status]}
        />
      )
    );
  }
};

export default TaskList;
