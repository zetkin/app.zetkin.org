import { GetServerSideProps } from 'next';
import { Box, Grid } from '@mui/material';

import ActivityList from 'features/projects/components/ActivityList';
import FilterActivities from 'features/projects/components/ActivityList/FilterActivities';
import messageIds from 'features/projects/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleProjectLayout from 'features/projects/layout/SingleProjectLayout';
import useActivityList from 'features/projects/hooks/useActivityList';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import ZUIFuture from 'zui/ZUIFuture';
import useActivityFilters from 'features/projects/hooks/useActivityFilters';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { projectId, orgId } = ctx.params!;

    return {
      props: {
        orgId,
        projectId,
      },
    };
  },
  {
    authLevelRequired: 2,
    localeScope: ['layout.organize.surveys', 'pages.organizeSurvey'],
  }
);

interface ProjectActivitiesPageProps {
  orgId: string;
  projectId: string;
}

const ProjectActivitiesPage: PageWithLayout<
  ProjectActivitiesPageProps
> = () => {
  const messages = useMessages(messageIds);
  const onServer = useServerSide();
  const { orgId, projectId } = useNumericRouteParams();
  const projectActivitiesFuture = useActivityList(orgId, projectId);
  const { filters, onFiltersChange, onSearchStringChange, searchString } =
    useActivityFilters('activities', orgId, projectId);

  if (onServer) {
    return null;
  }

  return (
    <Box>
      <ZUIFuture future={projectActivitiesFuture}>
        {(data) => {
          if (data.length === 0) {
            return (
              <ZUIEmptyState
                href={`/organize/${orgId}/projects/${projectId}/archive`}
                linkMessage={messages.singleProject.viewArchive()}
                message={messages.singleProject.noActivities()}
              />
            );
          }

          const activityTypes = data?.map((activity) => activity.kind);
          const filterTypes = [...new Set(activityTypes)];

          return (
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
          );
        }}
      </ZUIFuture>
    </Box>
  );
};

ProjectActivitiesPage.getLayout = function getLayout(page) {
  return <SingleProjectLayout>{page}</SingleProjectLayout>;
};

export default ProjectActivitiesPage;
