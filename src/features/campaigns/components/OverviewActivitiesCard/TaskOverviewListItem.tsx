import { FC } from 'react';
import { CheckBoxOutlined, People } from '@mui/icons-material';

import TaskModel from 'features/tasks/models/TaskModel';
import useModel from 'core/useModel';
import { ZetkinTask } from 'utils/types/zetkin';
import OverviewListItem, { STATUS_COLORS } from './OverviewListItem';

interface TasksOverviewListItemProps {
  task: ZetkinTask;
}

const TaskOverviewListItem: FC<TasksOverviewListItemProps> = ({ task }) => {
  const model = useModel(
    (env) => new TaskModel(env, task.organization.id, task.id)
  );
  const data = model.getTask().data;

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
      href={`/organize/${task.organization.id}/projects/${
        data.campaign?.id ?? 'standalone'
      }/calendar/tasks/${task.id}`}
      PrimaryIcon={CheckBoxOutlined}
      SecondaryIcon={People}
      title={data.title}
    />
  );
};

export default TaskOverviewListItem;
