import { FC } from 'react';
import { Map, Person } from '@mui/icons-material';

import { AreaAssignmentActivity } from 'features/campaigns/types';
import ActivityListItem from './ActivityListItem';
import useAreaAssignment from 'features/areaAssignments/hooks/useAreaAssignment';
import useAreaAssignees from 'features/areaAssignments/hooks/useAreaAssignees';
import getAreaAssignees from 'features/areaAssignments/utils/getAreaAssignees';
import getStatusColor from 'features/campaigns/utils/getStatusColor';
import { ZetkinAreaAssignee } from 'features/areaAssignments/types';

type Props = {
  activity: AreaAssignmentActivity;
  caId: number;
  orgId: number;
};

const AreaAssignmentListItem: FC<Props> = ({ caId, orgId, activity }) => {
  const { data: assignment } = useAreaAssignment(orgId, caId);

  const allSessions = useAreaAssignees(orgId, caId);
  const sessions = allSessions.filter(
    (session: ZetkinAreaAssignee) => session.assignment_id === caId
  );

  if (!assignment) {
    return null;
  }

  const areaAssignees = getAreaAssignees(sessions);
  const color = getStatusColor(activity.visibleFrom, activity.visibleUntil);

  return (
    <ActivityListItem
      color={color}
      endNumber={areaAssignees.length}
      href={`/organize/${orgId}/projects/${
        assignment?.project_id ?? 'standalone'
      }/areaassignments/${caId}`}
      PrimaryIcon={Map}
      SecondaryIcon={Person}
      title={assignment?.title}
    />
  );
};

export default AreaAssignmentListItem;
