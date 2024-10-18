import { FC } from 'react';
import { Map } from '@mui/icons-material';

import ActivityListItem, { STATUS_COLORS } from './ActivityListItem';
import useCanvassAssignment from 'features/canvassAssignments/hooks/useCanvassAssignment';

type Props = {
  caId: string;
  orgId: number;
};

const CanvassAssignmentListItem: FC<Props> = ({ caId, orgId }) => {
  const { data: assignment } = useCanvassAssignment(orgId, caId);

  if (!assignment) {
    return null;
  }

  const color = STATUS_COLORS.GRAY;

  return (
    <ActivityListItem
      color={color}
      endNumber={''}
      href={`/organize/${orgId}/projects/${
        assignment?.campaign?.id ?? 'standalone'
      }/canvassassignments/${caId}`}
      PrimaryIcon={Map}
      SecondaryIcon={Map}
      title={assignment?.title || ''}
    />
  );
};

export default CanvassAssignmentListItem;
