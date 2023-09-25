import { CheckBoxOutlined, People } from '@mui/icons-material';

import ActivityListItemWithStats from './ActivityListItemWithStats';
import { STATUS_COLORS } from './ActivityListItem';
import useTask from 'features/tasks/hooks/useTask';
import getTaskStatus, { TASK_STATUS } from 'features/tasks/utils/getTaskStatus';

interface TaskListItemProps {
  orgId: number;
  taskId: number;
}

const TaskListItem = ({ orgId, taskId }: TaskListItemProps) => {
  const { getTask, getTaskStats } = useTask(orgId, taskId);
  const task = getTask().data;
  const stats = getTaskStats().data;

  if (!task) {
    return null;
  }

  const taskStatus = getTaskStatus(task);
  let color = STATUS_COLORS.GRAY;

  if (taskStatus === TASK_STATUS.ACTIVE || taskStatus === TASK_STATUS.CLOSED) {
    color = STATUS_COLORS.GREEN;
  } else if (taskStatus === TASK_STATUS.EXPIRED) {
    color = STATUS_COLORS.RED;
  } else if (taskStatus === TASK_STATUS.SCHEDULED) {
    color = STATUS_COLORS.BLUE;
  }

  const statsLoading = getTaskStats().isLoading;

  return (
    <ActivityListItemWithStats
      blueChipValue={stats?.assigned}
      color={color}
      endNumber={stats?.individuals ?? 0}
      greenChipValue={stats?.completed}
      href={`/organize/${orgId}/projects/${
        task.campaign?.id ?? 'standalone'
      }/calendar/tasks/${taskId}`}
      orangeChipValue={stats?.ignored}
      PrimaryIcon={CheckBoxOutlined}
      SecondaryIcon={People}
      statsLoading={statsLoading}
      title={task.title}
    />
  );
};

export default TaskListItem;
