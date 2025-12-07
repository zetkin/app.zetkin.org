import { GetServerSideProps } from 'next';
import { Box, Grid } from '@mui/material';
import { ChangeEvent, useState } from 'react';

import ActivityList from 'features/campaigns/components/ActivityList';
import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import FilterActivities from 'features/campaigns/components/ActivityList/FilterActivities';
import messageIds from 'features/campaigns/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useActivityList from 'features/campaigns/hooks/useActivityList';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import { ACTIVITIES, CampaignActivity } from 'features/campaigns/types';

export const getServerSideProps: GetServerSideProps = scaffold(
  async () => {
    return {
      props: {},
    };
  },
  {
    authLevelRequired: 2,
    localeScope: ['layout.organize.surveys', 'pages.organizeSurvey'],
  }
);

const CampaignActivitiesPage: PageWithLayout = () => {
  const messages = useMessages(messageIds);
  const onServer = useServerSide();
  const { orgId, campId } = useNumericRouteParams();
  const data = useActivityList(orgId, campId);
  const [searchString, setSearchString] = useState('');
  const [filters, setFilters] = useState<ACTIVITIES[]>([
    ACTIVITIES.CALL_ASSIGNMENT,
    ACTIVITIES.AREA_ASSIGNMENT,
    ACTIVITIES.SURVEY,
    ACTIVITIES.TASK,
    ACTIVITIES.EMAIL,
  ]);

  const onFiltersChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const filter = evt.target.value as ACTIVITIES;
    if (filters.includes(filter)) {
      setFilters(filters.filter((a) => a !== filter));
    } else {
      setFilters([...filters, filter]);
    }
  };

  const onSearchStringChange = (value: string) => setSearchString(value);

  if (onServer) {
    return null;
  }

  if (data.length === 0) {
    return (
      <Box>
        <ZUIEmptyState
          href={`/organize/${orgId}/projects/archive`}
          linkMessage={messages.allProjects.viewArchive()}
          message={messages.allProjects.noActivities()}
        />
      </Box>
    );
  }

  const activityTypes = data.map((activity: CampaignActivity) => activity.kind);
  const filterTypes = [...new Set(activityTypes)];

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ sm: 8 }}>
          <ActivityList
            allActivities={data}
            filters={filters}
            orgId={orgId}
            searchString={searchString}
          />
        </Grid>

        <Grid size={{ sm: 4 }}>
          <FilterActivities
            filters={filters}
            filterTypes={filterTypes}
            onFiltersChange={onFiltersChange}
            onSearchStringChange={onSearchStringChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

CampaignActivitiesPage.getLayout = function getLayout(page) {
  return <AllCampaignsLayout>{page}</AllCampaignsLayout>;
};

export default CampaignActivitiesPage;
