import { FC } from 'react';
import CallAssignmentModel, {
  CallAssignmentState,
} from 'features/callAssignments/models/CallAssignmentModel';
import { CheckBoxOutlined, People } from '@mui/icons-material';

import useModel from 'core/useModel';
import OverviewListItem, { STATUS_COLORS } from './OverviewListItem';
import TaskModel from 'features/tasks/models/TaskModel';

interface TasksOverviewListItemProps {
  orgId: number;
  taskId: number;
}

const TasksOverviewListItem: FC<TasksOverviewListItemProps> = ({
  taskId,
  orgId,
}) => {
  const model = useModel((env) => new TaskModel(env, orgId, taskId));
  const data = model.getTask().data;
  const stats = model.getTaskStats().data;

  if (!data) {
    return null;
  }

  const today = new Date().toString();

  let color = STATUS_COLORS.GRAY;
  if (data.expires === today) {
    color = STATUS_COLORS.RED;
  } else {
    color = STATUS_COLORS.GREEN;
  }

  return (
    <OverviewListItem
      color={color}
      endNumber={data.target.id.toString()}
      href={`/organize/${orgId}/campaigns/${
        data.campaign?.id ?? 'standalone'
      }/activities/${taskId}`}
      PrimaryIcon={CheckBoxOutlined}
      SecondaryIcon={People}
      title={data.title}
    />
  );
};

export default TasksOverviewListItem;
