import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';

import ActivityList from 'features/campaigns/components/ActivityList';
import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import CampaignActivitiesModel from 'features/campaigns/models/CampaignAcitivitiesModel';
import messageIds from 'features/campaigns/l10n/messageIds';
import NoActivities from 'features/campaigns/components/NoActivities';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import useServerSide from 'core/useServerSide';

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
  const messages = useMessages(messageIds);
  const onServer = useServerSide();
  const model = useModel(
    (env) => new CampaignActivitiesModel(env, parseInt(orgId))
  );
  const activities = model.getStandaloneActivities().data;

  if (onServer) {
    return null;
  }

  const hasActivities = Array.isArray(activities) && activities.length > 0;

  return (
    <Box>
      {!hasActivities && (
        <NoActivities
          href={`/organize/${orgId}/campaigns`}
          linkMessage={messages.allProjects.linkToSummary()}
          message={messages.allProjects.noActivities()}
        />
      )}
      {hasActivities && (
        <ActivityList activities={activities} orgId={parseInt(orgId)} />
      )}
    </Box>
  );
};

CampaignActivitiesPage.getLayout = function getLayout(page) {
  return <AllCampaignsLayout>{page}</AllCampaignsLayout>;
};

export default CampaignActivitiesPage;
