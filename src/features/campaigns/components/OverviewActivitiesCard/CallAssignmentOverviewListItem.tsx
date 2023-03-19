import { FC } from 'react';
import { HeadsetMic } from '@mui/icons-material';

import { CallAssignmentActivity } from 'features/campaigns/models/CampaignActivitiesModel';
import useModel from 'core/useModel';
import CallAssignmentModel, {
  CallAssignmentState,
} from 'features/callAssignments/models/CallAssignmentModel';
import OverviewListItem, { STATUS_COLORS } from './OverviewListItem';

interface CallAssignmentOverviewListItemProps {
  activity: CallAssignmentActivity;
  focusDate: Date | null;
}

const CallAssignmentOverviewListItem: FC<
  CallAssignmentOverviewListItemProps
> = ({ activity, focusDate }) => {
  const assignment = activity.data;
  const dataModel = useModel(
    (env) =>
      new CallAssignmentModel(env, assignment.organization.id, assignment.id)
  );
  const data = dataModel.getData().data;
  const stats = dataModel.getStats().data;

  if (!data) {
    return null;
  }

  const state = dataModel.state;
  let color = STATUS_COLORS.GRAY;
  if (
    state === CallAssignmentState.ACTIVE ||
    state == CallAssignmentState.OPEN
  ) {
    color = STATUS_COLORS.GREEN;
  } else if (state === CallAssignmentState.SCHEDULED) {
    color = STATUS_COLORS.BLUE;
  } else if (state == CallAssignmentState.CLOSED) {
    color = STATUS_COLORS.RED;
  }

  const submissionCount = stats?.allTargets || 0;

  return (
    <OverviewListItem
      activity={activity}
      color={color}
      endNumber={submissionCount.toString()}
      focusDate={focusDate}
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
