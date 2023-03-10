import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';

import CallAssignmentListItem from 'features/campaigns/components/CallAssignmentListItem';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import SurveyListItem from 'features/campaigns/components/SurveyListItem';
import useModel from 'core/useModel';
import CampaignActivitiesModel, {
  ACTIVITIES,
} from 'features/campaigns/models/CampaignAcitivitiesModel';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId } = ctx.params!;

    return {
      props: {
        campId,
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
  campId: string;
  orgId: string;
}

const CampaignActivitiesPage: PageWithLayout<CampaignActivitiesPageProps> = ({
  orgId,
}) => {
  const model = useModel(
    (env) => new CampaignActivitiesModel(env, parseInt(orgId))
  );
  const activities = model.getActvities().data;

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
        }
      })}
    </Box>
  );
};

CampaignActivitiesPage.getLayout = function getLayout(page) {
  return <SingleCampaignLayout>{page}</SingleCampaignLayout>;
};

export default CampaignActivitiesPage;
