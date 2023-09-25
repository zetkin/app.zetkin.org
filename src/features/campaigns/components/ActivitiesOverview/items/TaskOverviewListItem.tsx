import { FC } from 'react';
import { CheckBoxOutlined, People } from '@mui/icons-material';

import OverviewListItem from './OverviewListItem';
import { TaskActivity } from 'features/campaigns/models/CampaignActivitiesModel';
import useTask from 'features/tasks/hooks/useTask';
import ZUIStackedStatusBar from 'zui/ZUIStackedStatusBar';

interface TasksOverviewListItemProps {
  activity: TaskActivity;
  focusDate: Date | null;
}

const TaskOverviewListItem: FC<TasksOverviewListItemProps> = ({
  activity,
  focusDate,
}) => {
  const task = activity.data;
  const { getTaskStats } = useTask(task.organization.id, task.id);

  const stats = getTaskStats().data;

  return (
    <OverviewListItem
      endDate={activity.visibleUntil}
      endNumber={stats?.individuals || 0}
      focusDate={focusDate}
      href={`/organize/${task.organization.id}/projects/${
        task.campaign?.id ?? 'standalone'
      }/calendar/tasks/${task.id}`}
      PrimaryIcon={CheckBoxOutlined}
      SecondaryIcon={People}
      startDate={activity.visibleFrom}
      statusBar={
        stats?.assigned ? (
          <ZUIStackedStatusBar
            height={4}
            values={[
              {
                color: 'statusColors.orange',
                value: stats.ignored,
              },
              {
                color: 'statusColors.blue',
                value: stats.assigned - stats.completed - stats.ignored,
              },
              {
                color: 'statusColors.green',
                value: stats.completed,
              },
            ]}
          />
        ) : null
      }
      title={task.title}
    />
  );
};

export default TaskOverviewListItem;
