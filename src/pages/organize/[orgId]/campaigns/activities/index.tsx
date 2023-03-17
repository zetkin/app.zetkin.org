import { GetServerSideProps } from 'next';
import { Box, Grid } from '@mui/material';

import ActivityList from 'features/campaigns/components/ActivityList';
import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import CampaignActivitiesModel from 'features/campaigns/models/CampaignActivitiesModel';
import FilterActivities from 'features/campaigns/components/ActivityList/FilterActivities';
import messageIds from 'features/campaigns/l10n/messageIds';
import NoActivities from 'features/campaigns/components/NoActivities';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import useServerSide from 'core/useServerSide';
import { ChangeEvent, useState } from 'react';

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
  const [searchString, setSearchString] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const activities = model.getStandaloneActivities().data;

  if (onServer) {
    return null;
  }

  const hasActivities = Array.isArray(activities) && activities.length > 0;

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setSearchString(evt.target.value);
    if (evt.target.value === '') {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
  };

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
        <Grid container spacing={2}>
          <Grid item sm={8}>
            <ActivityList
              activities={activities}
              isSearching={isSearching}
              orgId={parseInt(orgId)}
              searchString={searchString}
            />
          </Grid>
          <Grid item sm={4}>
            <FilterActivities onChange={handleChange} value={searchString} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

CampaignActivitiesPage.getLayout = function getLayout(page) {
  return <AllCampaignsLayout>{page}</AllCampaignsLayout>;
};

export default CampaignActivitiesPage;
