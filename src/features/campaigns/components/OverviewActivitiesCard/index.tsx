import { FC } from 'react';
import { Box, Divider, Typography } from '@mui/material';

import CallAssignmentOverviewListItem from './CallAssignmentOverviewListItem';
import messageIds from 'features/campaigns/l10n/messageIds';
import NoActivitiesOverview from './NoActivities';
import SurveyOverviewListItem from './SurveyOverviewListItem';
import TaskOverviewListItem from './TaskOverviewListItem';
import ZUICard from 'zui/ZUICard';
import {
  ACTIVITIES,
  CampaignActivity,
} from 'features/campaigns/models/CampaignActivitiesModel';
import { Msg, useMessages } from 'core/i18n';

type OverviewListProps = {
  activities: CampaignActivity[];
  focusDate: Date | null;
  header: string;
};

const OverviewActivitiesCard: FC<OverviewListProps> = ({
  activities,
  focusDate,
  header,
}) => {
  const messages = useMessages(messageIds);
  const truncActivities = activities.slice(0, 6);
  const numExtra = activities.length - truncActivities.length;
  return (
    <ZUICard header={header}>
      {activities.length === 0 && (
        <NoActivitiesOverview
          message={messages.activitiesCard.nothingToday()}
        />
      )}
      {truncActivities.map((activity, index) => {
        if (activity.kind === ACTIVITIES.CALL_ASSIGNMENT) {
          return (
            <Box key={`ca-${activity.id}`}>
              {index > 0 && <Divider />}
              <CallAssignmentOverviewListItem
                assignment={activity}
                focusDate={focusDate}
              />
            </Box>
          );
        } else if (activity.kind === ACTIVITIES.SURVEY) {
          return (
            <Box key={`survey-${activity.id}`}>
              {index > 0 && <Divider />}
              <SurveyOverviewListItem focusDate={focusDate} survey={activity} />
            </Box>
          );
        } else if (activity.kind === ACTIVITIES.TASK) {
          return (
            <Box key={`task-${activity.id}`}>
              {index > 0 && <Divider />}
              <TaskOverviewListItem focusDate={focusDate} task={activity} />
            </Box>
          );
        }
      })}
      {numExtra > 0 && (
        <Box textAlign="center">
          <Typography>
            <Msg
              id={messageIds.activitiesCard.extraActivities}
              values={{ numExtra }}
            />
          </Typography>
        </Box>
      )}
    </ZUICard>
  );
};

export default OverviewActivitiesCard;
