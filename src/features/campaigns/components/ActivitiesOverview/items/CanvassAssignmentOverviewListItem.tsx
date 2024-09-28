import { FC } from 'react';
import { Map } from '@mui/icons-material';

import { CanvassAssignmentActivity } from 'features/campaigns/types';
import getStatusColor from 'features/campaigns/utils/getStatusColor';
import OverviewListItem from './OverviewListItem';

type Props = {
  activity: CanvassAssignmentActivity;
  focusDate: Date | null;
};

const CanvassAssignmentOverviewListItem: FC<Props> = ({
  activity,
  focusDate,
}) => {
  const assignment = activity.data;

  return (
    <OverviewListItem
      color={getStatusColor(activity.visibleFrom, activity.visibleUntil)}
      endDate={activity.visibleUntil}
      endNumber={''}
      focusDate={focusDate}
      href={`/organize/${assignment.organization.id}/projects/${
        assignment.campaign?.id ?? 'standalone'
      }/canvassassignments/${assignment.id}`}
      PrimaryIcon={Map}
      SecondaryIcon={null}
      startDate={activity.visibleFrom}
      statusBar={null}
      title={assignment.title || ''}
    />
  );
};

export default CanvassAssignmentOverviewListItem;
