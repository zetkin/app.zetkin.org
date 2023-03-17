import { GetServerSideProps } from 'next';
import { Box, Grid } from '@mui/material';

import ActivityList from 'features/campaigns/components/ActivityList';
import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import FilterActivities from 'features/campaigns/components/ActivityList/FilterActivities';
import messageIds from 'features/campaigns/l10n/messageIds';
import NoActivities from 'features/campaigns/components/NoActivities';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import useServerSide from 'core/useServerSide';
import CampaignActivitiesModel, {
  ACTIVITIES,
} from 'features/campaigns/models/CampaignActivitiesModel';
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
  const [filters, setFilters] = useState<ACTIVITIES[]>([
    ACTIVITIES.CALL_ASSIGNMENT,
    ACTIVITIES.SURVEY,
    ACTIVITIES.TASK,
  ]);

  const onFiltersChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const filter = evt.target.value as ACTIVITIES;
    if (filters.includes(filter)) {
      setFilters(filters.filter((a) => a !== filter));
    } else {
      setFilters([...filters, filter]);
    }
  };

  const onSearchStringChange = (evt: ChangeEvent<HTMLInputElement>) =>
    setSearchString(evt.target.value);

  const activities = model.getStandaloneActivities().data;
  const hasActivities = Array.isArray(activities) && activities.length > 0;

  const activityTypes = activities?.map((activity) => activity.kind);
  const filterTypes = [...new Set(activityTypes)];

  if (onServer) {
    return null;
  }

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
              allActivities={activities}
              filters={filters}
              orgId={parseInt(orgId)}
              searchString={searchString}
            />
          </Grid>
          <Grid item sm={4}>
            <FilterActivities
              filters={filters}
              filterTypes={filterTypes}
              onFiltersChange={onFiltersChange}
              onSearchStringChange={onSearchStringChange}
              value={searchString}
            />
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
