import { FC } from 'react';
import { Map, Person } from '@mui/icons-material';

import ActivityListItem, { STATUS_COLORS } from './ActivityListItem';
import useCanvassAssignment from 'features/canvassAssignments/hooks/useCanvassAssignment';
import useCanvassSessions from 'features/canvassAssignments/hooks/useCanvassSessions';
import getCanvassers from 'features/canvassAssignments/utils/getCanvassers';

type Props = {
  caId: string;
  orgId: number;
  visibleFrom: Date | null;
  visibleUntil: Date | null;
};

const CanvassAssignmentListItem: FC<Props> = ({
  caId,
  orgId,
  visibleFrom,
  visibleUntil,
}) => {
  const { data: assignment } = useCanvassAssignment(orgId, caId);

  const allSessions = useCanvassSessions(orgId, caId).data || [];
  const sessions = allSessions.filter(
    (session) => session.assignment.id === caId
  );

  if (!assignment) {
    return null;
  }

  const canvassers = getCanvassers(sessions);
  const color = STATUS_COLORS.GRAY;

  return (
    <ActivityListItem
      color={color}
      endDate={visibleUntil ? visibleUntil.toString() : null}
      endNumber={canvassers.length}
      href={`/organize/${orgId}/projects/${
        assignment?.campaign?.id ?? 'standalone'
      }/canvassassignments/${caId}`}
      PrimaryIcon={Map}
      SecondaryIcon={Person}
      startDate={visibleFrom ? visibleFrom.toString() : null}
      title={assignment?.title || ''}
    />
  );
};

export default CanvassAssignmentListItem;
