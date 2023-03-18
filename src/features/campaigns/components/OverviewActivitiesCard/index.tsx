import { FC } from 'react';
import { Box, Divider } from '@mui/material';

import CallAssignmentOverviewListItem from './CallAssignmentOverviewListItem';
import messageIds from 'features/campaigns/l10n/messageIds';
import NoActivitiesOverview from './NoActivities';
import SurveyOverviewListItem from './SurveyOverviewListItem';
import TaskOverviewListItem from './TaskOverviewListItem';
import { useMessages } from 'core/i18n';
import ZUICard from 'zui/ZUICard';
import {
  ACTIVITIES,
  CampaignActivity,
} from 'features/campaigns/models/CampaignActivitiesModel';

type OverviewListProps = {
  activities: CampaignActivity[];
  header: string;
};

const OverviewActivitiesCard: FC<OverviewListProps> = ({
  activities,
  header,
}) => {
  const messages = useMessages(messageIds);
  return (
    <ZUICard header={header}>
      {activities.length === 0 && (
        <NoActivitiesOverview
          message={messages.activitiesCard.nothingToday()}
        />
      )}
      {activities.map((activity, index) => {
        if (activity.kind === ACTIVITIES.CALL_ASSIGNMENT) {
          return (
            <Box key={`ca-${activity.id}`}>
              {index > 0 && <Divider />}
              <CallAssignmentOverviewListItem assignment={activity} />
            </Box>
          );
        } else if (activity.kind === ACTIVITIES.SURVEY) {
          return (
            <Box key={`survey-${activity.id}`}>
              {index > 0 && <Divider />}
              <SurveyOverviewListItem survey={activity} />
            </Box>
          );
        } else if (activity.kind === ACTIVITIES.TASK) {
          return (
            <Box key={`task-${activity.id}`}>
              {index > 0 && <Divider />}
              <TaskOverviewListItem task={activity} />
            </Box>
          );
        }
      })}
    </ZUICard>
  );
};

export default OverviewActivitiesCard;
