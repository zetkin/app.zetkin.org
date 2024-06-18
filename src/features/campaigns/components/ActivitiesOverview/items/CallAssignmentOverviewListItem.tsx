import { FC } from 'react';
import { HeadsetMic, PhoneOutlined } from '@mui/icons-material';

import { CallAssignmentActivity } from 'features/campaigns/types';
import getStatusColor from 'features/campaigns/utils/getStatusColor';
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
  const { statsFuture } = useCallAssignmentStats(
    assignment.organization.id,
    assignment.id
  );
  const callsMade = statsFuture.data?.callsMade ?? 0;

  return (
    <OverviewListItem
      color={getStatusColor(activity.visibleFrom, activity.visibleUntil)}
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
        statsFuture.data?.allTargets ? (
          <ZUIStackedStatusBar
            height={4}
            values={[
              { color: 'statusColors.orange', value: statsFuture.data.blocked },
              { color: 'statusColors.blue', value: statsFuture.data.ready },
              { color: 'statusColors.green', value: statsFuture.data.done },
            ]}
          />
        ) : null
      }
      title={assignment.title}
    />
  );
};

export default CallAssignmentOverviewListItem;
