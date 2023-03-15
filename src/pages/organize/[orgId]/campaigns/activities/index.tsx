import { GetServerSideProps } from 'next';
import { InfoOutlined } from '@mui/icons-material';
import NextLink from 'next/link';
import { Box, Link, Typography } from '@mui/material';

import ActivityList from 'features/campaigns/components/ActivityList';
import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import CampaignActivitiesModel from 'features/campaigns/models/CampaignAcitivitiesModel';
import messageIds from 'features/campaigns/l10n/messageIds';
import { Msg } from 'core/i18n';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
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
  const onServer = useServerSide();
  const model = useModel(
    (env) => new CampaignActivitiesModel(env, parseInt(orgId))
  );
  const activities = model
    .getCurrentActivities()
    .data?.filter((activity) => activity.campaign === null);

  if (onServer) {
    return null;
  }

  const hasActivities = Array.isArray(activities) && activities.length > 0;

  return (
    <Box>
      {!hasActivities && (
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          paddingTop={5}
        >
          <InfoOutlined color="secondary" sx={{ fontSize: '12em' }} />
          <Typography color="secondary">
            <Msg id={messageIds.activityList.noActivities} />
          </Typography>
          <NextLink href={`/organize/${orgId}/campaigns`} passHref>
            <Link underline="none">
              <Typography color="secondary">
                <Msg id={messageIds.activityList.linkToSummary} />
              </Typography>
            </Link>
          </NextLink>
        </Box>
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
