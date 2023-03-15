import { Box, Card, Divider } from '@mui/material';

import CallAssignmentListItem from './CallAssignmentListItem';
import SurveyListItem from './SurveyListItem';
import TaskListItem from './TaskListItem';
import {
  ACTIVITIES,
  CampaignAcitivity,
} from 'features/campaigns/models/CampaignAcitivitiesModel';

interface ActivityListProps {
  activities: CampaignAcitivity[];
  orgId: number;
}

const ActivityList = ({ activities, orgId }: ActivityListProps) => {
  return (
    <Card>
      {activities.map((activity, index) => {
        if (activity.kind === ACTIVITIES.CALL_ASSIGNMENT) {
          return (
            <Box key={`ca-${activity.id}`}>
              {index > 0 && <Divider />}
              <CallAssignmentListItem caId={activity.id} orgId={orgId} />
            </Box>
          );
        } else if (activity.kind === ACTIVITIES.SURVEY) {
          return (
            <Box key={`survey-${activity.id}`}>
              {index > 0 && <Divider />}
              <SurveyListItem orgId={orgId} surveyId={activity.id} />
            </Box>
          );
        } else if (activity.kind === ACTIVITIES.TASK) {
          return (
            <Box key={`task-${activity.id}`}>
              {index > 0 && <Divider />}
              <TaskListItem orgId={orgId} taskId={activity.id} />
            </Box>
          );
        }
      })}
    </Card>
  );
};

export default ActivityList;
