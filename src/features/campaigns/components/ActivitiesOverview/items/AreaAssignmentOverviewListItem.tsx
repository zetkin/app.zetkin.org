import { FC } from 'react';
import { Map, Person } from '@mui/icons-material';

import { AreaAssignmentActivity } from 'features/campaigns/types';
import getStatusColor from 'features/campaigns/utils/getStatusColor';
import OverviewListItem from './OverviewListItem';
import useAreaAssignmentSessions from 'features/areaAssignments/hooks/useAreaAssignmentSessions';
import getAreaAssignees from 'features/areaAssignments/utils/getAreaAssignees';
import { useNumericRouteParams } from 'core/hooks';

type Props = {
  activity: AreaAssignmentActivity;
  focusDate: Date | null;
};

const AreaAssignmentOverviewListItem: FC<Props> = ({ activity, focusDate }) => {
  const assignment = activity.data;
  const { orgId } = useNumericRouteParams();

  const allSessions =
    useAreaAssignmentSessions(orgId, assignment.id).data || [];
  const sessions = allSessions.filter(
    (session) => session.assignment.id === assignment.id
  );

  const areaAssignees = getAreaAssignees(sessions);

  return (
    <OverviewListItem
      color={getStatusColor(activity.visibleFrom, activity.visibleUntil)}
      endDate={activity.visibleUntil}
      endNumber={areaAssignees.length}
      focusDate={focusDate}
      href={`/organize/${assignment.organization.id}/projects/${
        assignment.campaign?.id ?? 'standalone'
      }/areaassignments/${assignment.id}`}
      PrimaryIcon={Map}
      SecondaryIcon={Person}
      startDate={activity.visibleFrom}
      statusBar={null}
      title={assignment.title}
    />
  );
};

export default AreaAssignmentOverviewListItem;
