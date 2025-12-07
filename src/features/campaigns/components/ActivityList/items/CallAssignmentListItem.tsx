import { FC } from 'react';
import { HeadsetMic, PhoneOutlined } from '@mui/icons-material';

import ActivityListItemWithStats from './ActivityListItemWithStats';
import { STATUS_COLORS } from './ActivityListItem';
import useCallAssignment from 'features/callAssignments/hooks/useCallAssignment';
import useCallAssignmentStats from 'features/callAssignments/hooks/useCallAssignmentStats';
import useCallAssignmentState, {
  CallAssignmentState,
} from 'features/callAssignments/hooks/useCallAssignmentState';

interface CallAssignmentListItemProps {
  orgId: number;
  caId: number;
}

const CallAssignmentListItem: FC<CallAssignmentListItemProps> = ({
  caId,
  orgId,
}) => {
  const { data: callAssignment } = useCallAssignment(orgId, caId);
  const { stats } = useCallAssignmentStats(orgId, caId);
  const state = useCallAssignmentState(orgId, caId);

  if (!callAssignment) {
    return null;
  }

  let color = STATUS_COLORS.GREY;
  if (
    state === CallAssignmentState.ACTIVE ||
    state === CallAssignmentState.OPEN
  ) {
    color = STATUS_COLORS.GREEN;
  } else if (state === CallAssignmentState.CLOSED) {
    color = STATUS_COLORS.RED;
  } else if (state === CallAssignmentState.SCHEDULED) {
    color = STATUS_COLORS.BLUE;
  }

  const blocked = stats?.blocked || 0;
  const ready = stats?.ready || 0;
  const done = stats?.done || 0;
  const callsMade = stats?.callsMade.toString() || '0';

  return (
    <ActivityListItemWithStats
      blueChipValue={ready}
      color={color}
      endNumber={callsMade}
      greenChipValue={done}
      href={`/organize/${orgId}/projects/${
        callAssignment?.campaign?.id ?? 'standalone'
      }/callassignments/${caId}`}
      orangeChipValue={blocked}
      PrimaryIcon={HeadsetMic}
      SecondaryIcon={PhoneOutlined}
      statsLoading={!stats}
      title={callAssignment?.title}
    />
  );
};

export default CallAssignmentListItem;
