import { GetServerSideProps } from 'next';
import { Box, Grid } from '@mui/material';
import { ChangeEvent, useState } from 'react';

import ActivityList from 'features/campaigns/components/ActivityList';
import FilterActivities from 'features/campaigns/components/ActivityList/FilterActivities';
import messageIds from 'features/campaigns/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import useServerSide from 'core/useServerSide';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import CampaignActivitiesModel, {
  ACTIVITIES,
} from 'features/campaigns/models/CampaignActivitiesModel';

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

  const activities = model.getArchivedCampaignActivities(parseInt(campId)).data;
  const hasActivities = Array.isArray(activities) && activities.length > 0;

  const activityTypes = activities?.map((activity) => activity.kind);
  const filterTypes = [...new Set(activityTypes)];

  if (onServer) {
    return null;
  }
  return (
    <Box>
      {!hasActivities && (
        <ZUIEmptyState message={messages.singleProject.noActivities()} />
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
  return <SingleCampaignLayout>{page}</SingleCampaignLayout>;
};

export default CampaignActivitiesPage;
