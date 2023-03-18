import { FC } from 'react';
import { HeadsetMic } from '@mui/icons-material';

import useModel from 'core/useModel';
import SurveyDataModel, {
  SurveyState,
} from 'features/surveys/models/SurveyDataModel';
import OverviewListItem, { STATUS_COLORS } from './OverviewListItem';
import { ACTIVITIES } from 'features/campaigns/models/CampaignAcitivitiesModel';
import ZUIStackedStatusBar from 'zui/ZUIStackedStatusBar';
import { Box } from '@mui/material';
import CallAssignmentModel, {
  CallAssignmentState,
} from 'features/callAssignments/models/CallAssignmentModel';

interface CallAssignmentOverviewListItemProps {
  orgId: number;
  callAssignmentId: number;
  subtitle?: string;
}

const CallAssignmentOverviewListItem: FC<
  CallAssignmentOverviewListItemProps
> = ({ orgId, callAssignmentId, subtitle }) => {
  const dataModel = useModel(
    (env) => new CallAssignmentModel(env, orgId, callAssignmentId)
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
  //const unlinkedSubmissionCount = stats?.unlinkedSubmissionCount || 0;
  //const linkedSubmissionCount = submissionCount - unlinkedSubmissionCount || 0;

  return (
    <OverviewListItem
      color={color}
      endNumber={submissionCount.toString()}
      href={`/organize/${orgId}/campaigns/${
        data.campaign?.id ?? 'standalone'
      }/callassignments/${callAssignmentId}`}
      PrimaryIcon={HeadsetMic}
      SecondaryIcon={HeadsetMic}
      title={data.title}
      subtitle={subtitle}
      StatusBar={
        <ZUIStackedStatusBar
          colors={['red', 'blue', 'yellow']}
          values={[89, 25, 3]}
        ></ZUIStackedStatusBar>
      }
    />
  );
};

export default CallAssignmentOverviewListItem;
