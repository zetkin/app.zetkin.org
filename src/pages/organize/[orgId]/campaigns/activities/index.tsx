import { GetServerSideProps } from 'next';
import { Box, Card, Divider } from '@mui/material';

import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import CallAssignmentListItem from 'features/campaigns/components/CallAssignmentListItem';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SurveyListItem from 'features/campaigns/components/SurveyListItem';
import TaskListItem from 'features/campaigns/components/TaskListItem';
import useModel from 'core/useModel';
import useServerSide from 'core/useServerSide';
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
  const onServer = useServerSide();
  const model = useModel(
    (env) => new CampaignActivitiesModel(env, parseInt(orgId))
  );
  const activities = model
    .getCurrentActivities()
    .data?.filter((activity) => activity.campaign === null);

  if (!activities) {
    return <>No activities</>;
  }

  if (onServer) {
    return null;
  }

  return (
    <Card>
      {activities.map((activity, index) => {
        <Box key={`activity-${activity.id}`}></Box>;
        if (activity.kind === ACTIVITIES.CALL_ASSIGNMENT) {
          return (
            <Box key={`ca-${activity.id}`}>
              <CallAssignmentListItem
                caId={activity.id}
                orgId={parseInt(orgId)}
              />
            </Box>
          );
        } else if (activity.kind === ACTIVITIES.SURVEY) {
          return (
            <Box key={`survey-${activity.id}`}>
              {index > 0 && <Divider />}
              <SurveyListItem orgId={parseInt(orgId)} surveyId={activity.id} />
            </Box>
          );
        } else if (activity.kind === ACTIVITIES.TASK) {
          return (
            <Box key={`task-${activity.id}`}>
              {index > 0 && <Divider />}
              <TaskListItem orgId={parseInt(orgId)} taskId={activity.id} />
            </Box>
          );
        }
      })}
    </Card>
  );
};

CampaignActivitiesPage.getLayout = function getLayout(page) {
  return <AllCampaignsLayout>{page}</AllCampaignsLayout>;
};

export default CampaignActivitiesPage;
