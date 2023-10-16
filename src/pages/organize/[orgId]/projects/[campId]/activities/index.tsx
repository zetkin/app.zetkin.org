import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { Box, Grid } from '@mui/material';

import { ACTIVITIES } from 'features/campaigns/types';
import ActivityList from 'features/campaigns/components/ActivityList';
import FilterActivities from 'features/campaigns/components/ActivityList/FilterActivities';
import messageIds from 'features/campaigns/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import useAcitvityList from 'features/campaigns/hooks/useActivityList';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import ZUIFuture from 'zui/ZUIFuture';

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

const CampaignActivitiesPage: PageWithLayout<
  CampaignActivitiesPageProps
> = () => {
  const messages = useMessages(messageIds);
  const onServer = useServerSide();
  const { orgId, campId } = useNumericRouteParams();
  const campaignActivitiesFuture = useAcitvityList(orgId, campId);

  const [searchString, setSearchString] = useState('');
  const [filters, setFilters] = useState<ACTIVITIES[]>([
    ACTIVITIES.CALL_ASSIGNMENT,
    ACTIVITIES.SURVEY,
    ACTIVITIES.TASK,
  ]);

  if (onServer) {
    return null;
  }

  return (
    <Box>
      <ZUIFuture future={campaignActivitiesFuture}>
        {(data) => {
          if (data.length === 0) {
            return (
              <ZUIEmptyState
                href={`/organize/${orgId}/projects/${campId}/archive`}
                linkMessage={messages.singleProject.viewArchive()}
                message={messages.singleProject.noActivities()}
              />
            );
          }

          const activityTypes = data?.map((activity) => activity.kind);
          const filterTypes = [...new Set(activityTypes)];

          return (
            <Grid container spacing={2}>
              <Grid item sm={8}>
                <ActivityList
                  allActivities={data}
                  filters={filters}
                  orgId={orgId}
                  searchString={searchString}
                />
              </Grid>
              <Grid item sm={4}>
                <FilterActivities
                  filters={filters}
                  filterTypes={filterTypes}
                  onFiltersChange={(evt) => {
                    const filter = evt.target.value as ACTIVITIES;
                    if (filters.includes(filter)) {
                      setFilters(filters.filter((a) => a !== filter));
                    } else {
                      setFilters([...filters, filter]);
                    }
                  }}
                  onSearchStringChange={(value) => setSearchString(value)}
                />
              </Grid>
            </Grid>
          );
        }}
      </ZUIFuture>
    </Box>
  );
};

CampaignActivitiesPage.getLayout = function getLayout(page) {
  return <SingleCampaignLayout>{page}</SingleCampaignLayout>;
};

export default CampaignActivitiesPage;
