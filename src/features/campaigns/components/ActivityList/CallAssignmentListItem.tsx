import { FC } from 'react';
import CallAssignmentModel, {
  CallAssignmentState,
} from 'features/callAssignments/models/CallAssignmentModel';
import { HeadsetMic, PhoneOutlined } from '@mui/icons-material';

import useModel from 'core/useModel';
import ActivityListItem, { STATUS_COLORS } from './ActivityListItem';

interface CallAssignmentListItemProps {
  orgId: number;
  caId: number;
}

const CallAssignmentListItem: FC<CallAssignmentListItemProps> = ({
  caId,
  orgId,
}) => {
  const model = useModel((env) => new CallAssignmentModel(env, orgId, caId));
  const state = model.state;
  const data = model.getData().data;
  const stats = model.getStats().data;

  if (!data) {
    return null;
  }

  let color = STATUS_COLORS.GRAY;
  if (
    state === CallAssignmentState.ACTIVE ||
    state === CallAssignmentState.OPEN
  ) {
    color = STATUS_COLORS.GREEN;
  } else if (state === CallAssignmentState.CLOSED) {
    color = STATUS_COLORS.RED;
    color = STATUS_COLORS.BLUE;
  } else if (state === CallAssignmentState.SCHEDULED) {
    color = STATUS_COLORS.BLUE;
  }

  const blocked = stats?.blocked;
  const ready = stats?.ready;
  const done = stats?.done;
  const callsMade = stats?.callsMade.toString() || '';

  return (
    <ActivityListItem
      blueChipValue={ready}
      color={color}
      endNumber={callsMade}
      greenChipValue={done}
      href={`/organize/${orgId}/campaigns/${
        data.campaign?.id ?? 'standalone'
      }/callassignments/${caId}`}
      orangeChipValue={blocked}
      PrimaryIcon={HeadsetMic}
      SecondaryIcon={PhoneOutlined}
      title={data.title}
    />
  );
};

export default CallAssignmentListItem;
