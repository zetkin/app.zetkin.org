import { FC } from 'react';
import { CheckBoxOutlined, People } from '@mui/icons-material';

import OverviewListItem from './OverviewListItem';
import { TaskActivity } from 'features/campaigns/models/CampaignActivitiesModel';

interface TasksOverviewListItemProps {
  activity: TaskActivity;
  focusDate: Date | null;
}

const TaskOverviewListItem: FC<TasksOverviewListItemProps> = ({
  activity,
  focusDate,
}) => {
  const task = activity.data;

  return (
    <OverviewListItem
      activity={activity}
      endNumber=""
      focusDate={focusDate}
      href={`/organize/${task.organization.id}/projects/${
        task.campaign?.id ?? 'standalone'
      }/calendar/tasks/${task.id}`}
      PrimaryIcon={CheckBoxOutlined}
      SecondaryIcon={People}
      title={task.title}
    />
  );
};

export default TaskOverviewListItem;
