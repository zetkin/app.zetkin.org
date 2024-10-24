import { FC } from 'react';
import { Map, Person } from '@mui/icons-material';

import { CanvassAssignmentActivity } from 'features/campaigns/types';
import getStatusColor from 'features/campaigns/utils/getStatusColor';
import OverviewListItem from './OverviewListItem';
import useCanvassSessions from 'features/canvassAssignments/hooks/useCanvassSessions';
import getCanvassers from 'features/canvassAssignments/utils/getCanvassers';
import { useNumericRouteParams } from 'core/hooks';

type Props = {
  activity: CanvassAssignmentActivity;
  focusDate: Date | null;
};

const CanvassAssignmentOverviewListItem: FC<Props> = ({
  activity,
  focusDate,
}) => {
  const assignment = activity.data;
  const { orgId } = useNumericRouteParams();

  const allSessions = useCanvassSessions(orgId, assignment.id).data || [];
  const sessions = allSessions.filter(
    (session) => session.assignment.id === assignment.id
  );

  const canvassers = getCanvassers(sessions);

  return (
    <OverviewListItem
      color={getStatusColor(activity.visibleFrom, activity.visibleUntil)}
      endDate={activity.visibleUntil}
      endNumber={canvassers.length}
      focusDate={focusDate}
      href={`/organize/${assignment.organization.id}/projects/${
        assignment.campaign?.id ?? 'standalone'
      }/canvassassignments/${assignment.id}`}
      PrimaryIcon={Map}
      SecondaryIcon={Person}
      startDate={activity.visibleFrom}
      statusBar={null}
      title={assignment.title || ''}
    />
  );
};

export default CanvassAssignmentOverviewListItem;
