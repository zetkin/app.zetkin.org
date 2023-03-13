import TaskModel from 'features/tasks/models/TaskModel';
import useModel from 'core/useModel';
import { CheckBoxOutlined, People } from '@mui/icons-material';

import ActivityListItem, { STATUS_COLORS } from './ActivityListItem';
import getTaskStatus, { TASK_STATUS } from 'features/tasks/utils/getTaskStatus';

interface TaskListItemProps {
  orgId: number;
  taskId: number;
}

const TaskListItem = ({ orgId, taskId }: TaskListItemProps) => {
  const model = useModel((env) => new TaskModel(env, orgId));
  const task = model.getTask(taskId).data;
  const stats = model.getTaskStats(taskId).data;

  if (!task || !stats) {
    return null;
  }

  const taskStatus = getTaskStatus(task);
  let color = STATUS_COLORS.GRAY;

  if (taskStatus === TASK_STATUS.ACTIVE) {
    color = STATUS_COLORS.GREEN;
  } else if (
    taskStatus === TASK_STATUS.CLOSED ||
    taskStatus === TASK_STATUS.EXPIRED
  ) {
    color = STATUS_COLORS.RED;
  } else if (taskStatus === TASK_STATUS.SCHEDULED) {
    color = STATUS_COLORS.BLUE;
  }

  return (
    <ActivityListItem
      blueChipValue={stats.assigned}
      color={color}
      endNumber={stats.individuals.toString()}
      greenChipValue={stats.completed}
      orangeChipValue={stats.ignored}
      PrimaryIcon={CheckBoxOutlined}
      SecondaryIcon={People}
      title={task.title}
    />
  );
};

export default TaskListItem;
