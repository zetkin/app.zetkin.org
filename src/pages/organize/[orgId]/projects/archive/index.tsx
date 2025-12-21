import { GetServerSideProps } from 'next';
import { Box, Grid } from '@mui/material';

import ActivityList from 'features/campaigns/components/ActivityList';
import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import FilterActivities from 'features/campaigns/components/ActivityList/FilterActivities';
import messageIds from 'features/campaigns/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useActivityArchive from 'features/campaigns/hooks/useActivityArchive';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import ZUIFuture from 'zui/ZUIFuture';
import { CampaignActivity } from 'features/campaigns/types';
import useActivityFilters from 'features/campaigns/hooks/useActivityFilters';

export const getServerSideProps: GetServerSideProps = scaffold(
  async () => {
    return {
      props: {},
    };
  },
  {
    authLevelRequired: 2,
    localeScope: [],
  }
);

const ActivitiesArchivePage: PageWithLayout = () => {
  const messages = useMessages(messageIds);
  const onServer = useServerSide();
  const { orgId } = useNumericRouteParams();
  const archivedActivities = useActivityArchive(orgId);
  const { filters, onFiltersChange, onSearchStringChange, searchString } =
    useActivityFilters('archive', orgId);

  if (onServer) {
    return null;
  }

  return (
    <Box>
      <ZUIFuture future={archivedActivities} skeletonWidth={200}>
        {(data) => {
          if (data.length === 0) {
            return (
              <ZUIEmptyState
                href={`/organize/${orgId}/projects/activities`}
                linkMessage={messages.activitiesOverview.goToActivities()}
                message={messages.allProjects.noActivities()}
              />
            );
          }

          const activityTypes = data.map(
            (activity: CampaignActivity) => activity.kind
          );
          const filterTypes = [...new Set(activityTypes)];

          return (
            <Grid container spacing={2}>
              <Grid size={{ sm: 8 }}>
                <ActivityList
                  allActivities={data}
                  filters={filters}
                  orgId={orgId}
                  searchString={searchString}
                  sortNewestFirst
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
          );
        }}
      </ZUIFuture>
    </Box>
  );
};

ActivitiesArchivePage.getLayout = function getLayout(page) {
  return <AllCampaignsLayout>{page}</AllCampaignsLayout>;
};

export default ActivitiesArchivePage;
