import { FC } from 'react';
import { Map, Person } from '@mui/icons-material';

import { AreaAssignmentActivity } from 'features/campaigns/types';
import getStatusColor from 'features/campaigns/utils/getStatusColor';
import OverviewListItem from './OverviewListItem';
import useAreaAssignees from 'features/areaAssignments/hooks/useAreaAssignees';
import getAreaAssignees from 'features/areaAssignments/utils/getAreaAssignees';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinAreaAssignee } from 'features/areaAssignments/types';

type Props = {
  activity: AreaAssignmentActivity;
  focusDate: Date | null;
};

const AreaAssignmentOverviewListItem: FC<Props> = ({ activity, focusDate }) => {
  const assignment = activity.data;
  const { orgId } = useNumericRouteParams();

  const allSessions = useAreaAssignees(orgId, assignment.id);
  const sessions = allSessions.filter(
    (session: ZetkinAreaAssignee) => session.assignment_id === assignment.id
  );

  const areaAssignees = getAreaAssignees(sessions);

  return (
    <OverviewListItem
      color={getStatusColor(activity.visibleFrom, activity.visibleUntil)}
      endDate={activity.visibleUntil}
      endNumber={areaAssignees.length}
      focusDate={focusDate}
      href={`/organize/${assignment.organization_id}/projects/${assignment.project_id}/areaassignments/${assignment.id}`}
      PrimaryIcon={Map}
      SecondaryIcon={Person}
      startDate={activity.visibleFrom}
      statusBar={null}
      title={assignment.title}
    />
  );
};

export default AreaAssignmentOverviewListItem;
