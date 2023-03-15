import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';

import ActivityList from 'features/campaigns/components/ActivityList';
import CampaignActivitiesModel from 'features/campaigns/models/CampaignAcitivitiesModel';
import messageIds from 'features/campaigns/l10n/messageIds';
import NoActivities from 'features/campaigns/components/NoActivities';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import useServerSide from 'core/useServerSide';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { campId, orgId } = ctx.params!;

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
  campId,
  orgId,
}) => {
  const messages = useMessages(messageIds);
  const onServer = useServerSide();
  const model = useModel(
    (env) => new CampaignActivitiesModel(env, parseInt(orgId))
  );

  const activities = model.getCampaignActivities(parseInt(campId)).data;
  const hasActivities = Array.isArray(activities) && activities.length > 0;

  if (onServer) {
    return null;
  }

  return (
    <Box>
      {!hasActivities && (
        <NoActivities message={messages.singleProject.noActivities()} />
      )}
      {hasActivities && (
        <ActivityList activities={activities} orgId={parseInt(orgId)} />
      )}
    </Box>
  );
};

CampaignActivitiesPage.getLayout = function getLayout(page) {
  return <SingleCampaignLayout>{page}</SingleCampaignLayout>;
};

export default CampaignActivitiesPage;
