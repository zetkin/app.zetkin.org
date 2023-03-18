import { FC } from 'react';
import { HeadsetMic } from '@mui/icons-material';

import useModel from 'core/useModel';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import CallAssignmentModel, {
  CallAssignmentState,
} from 'features/callAssignments/models/CallAssignmentModel';
import OverviewListItem, { STATUS_COLORS } from './OverviewListItem';

interface CallAssignmentOverviewListItemProps {
  assignment: ZetkinCallAssignment;
}

const CallAssignmentOverviewListItem: FC<
  CallAssignmentOverviewListItemProps
> = ({ assignment }) => {
  const dataModel = useModel(
    (env) =>
      new CallAssignmentModel(env, assignment.organization.id, assignment.id)
  );
  const data = dataModel.getData().data;
  const stats = dataModel.getStats().data;

  if (!data) {
    return null;
  }

  let hasExpired = false;
  if (data.end_date) {
    const expires = new Date(data.end_date);
    const now = new Date();

    if (expires < now) {
      hasExpired = true;
    }
  }

  const state = dataModel.state;
  let color = STATUS_COLORS.GRAY;
  if (state === CallAssignmentState.ACTIVE) {
    color = STATUS_COLORS.GREEN;
  } else if (state === CallAssignmentState.SCHEDULED) {
    color = STATUS_COLORS.BLUE;
  } else if (hasExpired) {
    color = STATUS_COLORS.RED;
  }

  const submissionCount = stats?.allTargets || 0;

  return (
    <OverviewListItem
      color={color}
      endNumber={submissionCount.toString()}
      href={`/organize/${assignment.organization.id}/projects/${
        data.campaign?.id ?? 'standalone'
      }/callassignments/${assignment.id}`}
      PrimaryIcon={HeadsetMic}
      SecondaryIcon={HeadsetMic}
      title={data.title}
    />
  );
};

export default CallAssignmentOverviewListItem;
