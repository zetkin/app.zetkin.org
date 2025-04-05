import { FC } from 'react';
import { Map, Person } from '@mui/icons-material';

import ActivityListItem, { STATUS_COLORS } from './ActivityListItem';
import useAreaAssignment from 'features/areaAssignments/hooks/useAreaAssignment';
import useAreaAssignees from 'features/areaAssignments/hooks/useAreaAssignees';
import getAreaAssignees from 'features/areaAssignments/utils/getAreaAssignees';

type Props = {
  caId: number;
  orgId: number;
};

const AreaAssignmentListItem: FC<Props> = ({ caId, orgId }) => {
  const { data: assignment } = useAreaAssignment(orgId, caId);

  const allSessions = useAreaAssignees(orgId, caId).data || [];
  const sessions = allSessions.filter(
    (session) => session.assignment_id === caId
  );

  if (!assignment) {
    return null;
  }

  const areaAssignees = getAreaAssignees(sessions);
  const color = STATUS_COLORS.GRAY;

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
