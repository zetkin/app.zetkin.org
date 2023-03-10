import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';

import CallAssignmentListItem from 'features/campaigns/components/CallAssignmentListItem';
import CampaignActivitiesModel from 'features/campaigns/models/CampaignAcitivitiesModel';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import useModel from 'core/useModel';

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
        return (
          <CallAssignmentListItem
            key={activity.id}
            caId={activity.id}
            orgId={parseInt(orgId)}
          />
        );
      })}
    </Box>
  );
};

CampaignActivitiesPage.getLayout = function getLayout(page) {
  return <SingleCampaignLayout>{page}</SingleCampaignLayout>;
};

export default CampaignActivitiesPage;
