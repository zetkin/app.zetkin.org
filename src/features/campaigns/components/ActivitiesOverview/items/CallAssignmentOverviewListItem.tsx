import { FC } from 'react';
import { HeadsetMic, PhoneOutlined } from '@mui/icons-material';

import { CallAssignmentActivity } from 'features/campaigns/types';
import OverviewListItem from './OverviewListItem';
import useCallAssignmentStats from 'features/callAssignments/hooks/useCallAssignmentStats';
import ZUIStackedStatusBar from 'zui/ZUIStackedStatusBar';

interface CallAssignmentOverviewListItemProps {
  activity: CallAssignmentActivity;
  focusDate: Date | null;
}

const CallAssignmentOverviewListItem: FC<
  CallAssignmentOverviewListItemProps
> = ({ activity, focusDate }) => {
  const assignment = activity.data;
  const { data: stats } = useCallAssignmentStats(
    assignment.organization.id,
    assignment.id
  );
  const callsMade = stats?.callsMade ?? 0;

  return (
    <OverviewListItem
      endDate={activity.visibleUntil}
      endNumber={callsMade}
      focusDate={focusDate}
      href={`/organize/${assignment.organization.id}/projects/${
        assignment.campaign?.id ?? 'standalone'
      }/callassignments/${assignment.id}`}
      PrimaryIcon={HeadsetMic}
      SecondaryIcon={PhoneOutlined}
      startDate={activity.visibleFrom}
      statusBar={
        stats?.allTargets ? (
          <ZUIStackedStatusBar
            height={4}
            values={[
              { color: 'statusColors.orange', value: stats.blocked },
              { color: 'statusColors.blue', value: stats.ready },
              { color: 'statusColors.green', value: stats.done },
            ]}
          />
        ) : null
      }
      title={assignment.title}
    />
  );
};

export default CallAssignmentOverviewListItem;
