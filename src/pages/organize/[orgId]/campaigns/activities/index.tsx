import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';

import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import CallAssignmentListItem from 'features/campaigns/components/CallAssignmentListItem';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SurveyListItem from 'features/campaigns/components/SurveyListItem';
import TaskListItem from 'features/campaigns/components/TaskListItem';
import useModel from 'core/useModel';
import CampaignActivitiesModel, {
  ACTIVITIES,
} from 'features/campaigns/models/CampaignAcitivitiesModel';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId } = ctx.params!;

    return {
      props: {
        orgId,
      },
    };
  },
  {
    authLevelRequired: 2,
    localeScope: ['layout.organize.surveys', 'pages.organizeSurvey'],
  }
);

interface CampaignActivitiesPageProps {
  orgId: string;
}

const CampaignActivitiesPage: PageWithLayout<CampaignActivitiesPageProps> = ({
  orgId,
}) => {
  const model = useModel(
    (env) => new CampaignActivitiesModel(env, parseInt(orgId))
  );
  const activities = model.getCurrentActivities().data;

  if (!activities) {
    return <>No activities</>;
  }

  return (
    <Box
      sx={{
        borderColor: 'gray',
        borderStyle: 'solid solid none solid',
        borderWidth: '2px',
      }}
    >
      {activities.map((activity) => {
        if (activity.kind === ACTIVITIES.CALL_ASSIGNMENT) {
          return (
            <CallAssignmentListItem
              key={`ca-${activity.id}`}
              caId={activity.id}
              orgId={parseInt(orgId)}
            />
          );
        } else if (activity.kind === ACTIVITIES.SURVEY) {
          return (
            <SurveyListItem
              key={`survey-${activity.id}`}
              orgId={parseInt(orgId)}
              surveyId={activity.id}
            />
          );
        } else if (activity.kind === ACTIVITIES.TASK) {
          return (
            <TaskListItem
              key={`task-${activity.id}`}
              orgId={parseInt(orgId)}
              taskId={activity.id}
            />
          );
        }
      })}
    </Box>
  );
};

CampaignActivitiesPage.getLayout = function getLayout(page) {
  return <AllCampaignsLayout>{page}</AllCampaignsLayout>;
};

export default CampaignActivitiesPage;
