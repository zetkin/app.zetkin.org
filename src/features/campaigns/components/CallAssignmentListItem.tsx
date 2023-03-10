import { FC } from 'react';
import { Headset } from '@mui/icons-material';
import CallAssignmentModel, {
  CallAssignmentState,
} from 'features/callAssignments/models/CallAssignmentModel';

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
  } else if (state === CallAssignmentState.SCHEDULED) {
    color = STATUS_COLORS.BLUE;
  }

  let message = '';
  if (data.end_date) {
    const endDate = new Date(data.end_date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (endDate.getDate() === tomorrow.getDate()) {
      message = 'ends tomorrow';
    }
  } else if (data.start_date) {
    const startDate = new Date(data.start_date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (startDate.getDate() === tomorrow.getDate()) {
      message = 'begins tomorrow';
    }
  }

  const orangeChipValue = stats?.blocked;
  const blueChipValue = stats?.ready;
  const greenChipValue = stats?.done;
  const endNumber = stats?.callsMade.toString() || '';

  return (
    <ActivityListItem
      blueChipValue={blueChipValue}
      color={color}
      endNumber={endNumber}
      greenChipValue={greenChipValue}
      message={message}
      orangeChipValue={orangeChipValue}
      PrimaryIcon={Headset}
      title={data.title}
    />
  );
};

export default CallAssignmentListItem;
