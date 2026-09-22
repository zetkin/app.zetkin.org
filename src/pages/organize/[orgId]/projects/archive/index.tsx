import { GetServerSideProps } from 'next';
import { Box, Grid } from '@mui/material';

import ActivityList from 'features/projects/components/ActivityList';
import AllProjectsLayout from 'features/projects/layout/AllProjectsLayout';
import FilterActivities from 'features/projects/components/ActivityList/FilterActivities';
import messageIds from 'features/projects/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useActivityArchive from 'features/projects/hooks/useActivityArchive';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import ZUIFuture from 'zui/ZUIFuture';
import { ProjectActivity } from 'features/projects/types';
import useActivityFilters from 'features/projects/hooks/useActivityFilters';

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
            (activity: ProjectActivity) => activity.kind
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
  return <AllProjectsLayout>{page}</AllProjectsLayout>;
};

export default ActivitiesArchivePage;
