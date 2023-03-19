import { FC } from 'react';
import { HeadsetMic } from '@mui/icons-material';

import { CallAssignmentActivity } from 'features/campaigns/models/CampaignActivitiesModel';
import CallAssignmentModel from 'features/callAssignments/models/CallAssignmentModel';
import OverviewListItem from './OverviewListItem';
import useModel from 'core/useModel';

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

  const stats = dataModel.getStats().data;
  const submissionCount = stats?.allTargets || 0;

  return (
    <OverviewListItem
      activity={activity}
      endNumber={submissionCount.toString()}
      focusDate={focusDate}
      href={`/organize/${assignment.organization.id}/projects/${
        assignment.campaign?.id ?? 'standalone'
      }/callassignments/${assignment.id}`}
      PrimaryIcon={HeadsetMic}
      SecondaryIcon={HeadsetMic}
      title={assignment.title}
    />
  );
};

export default CallAssignmentOverviewListItem;
