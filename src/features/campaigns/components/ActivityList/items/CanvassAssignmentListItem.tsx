import { FC } from 'react';
import { Map } from '@mui/icons-material';

import ActivityListItem, { STATUS_COLORS } from './ActivityListItem';
import useCanvassAssignment from 'features/areas/hooks/useCanvassAssignment';

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

  if (!assignment) {
    return null;
  }

  const color = STATUS_COLORS.GRAY;

  return (
    <ActivityListItem
      color={color}
      endDate={visibleUntil ? visibleUntil.toString() : null}
      endNumber={''}
      href={`/organize/${orgId}/projects/${
        assignment?.campaign?.id ?? 'standalone'
      }/canvassassignments/${caId}`}
      PrimaryIcon={Map}
      SecondaryIcon={Map}
      startDate={visibleFrom ? visibleFrom.toString() : null}
      title={assignment?.title || ''}
    />
  );
};

export default CanvassAssignmentListItem;
