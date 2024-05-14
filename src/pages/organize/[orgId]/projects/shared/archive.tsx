import { GetServerSideProps } from 'next';
import { Box, Grid } from '@mui/material';
import { ChangeEvent, useState } from 'react';

import ActivityList from 'features/campaigns/components/ActivityList';
import FilterActivities from 'features/campaigns/components/ActivityList/FilterActivities';
import messageIds from 'features/campaigns/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SharedActivitiesLayout from 'features/campaigns/layout/SharedActivitiesLayout';
import useActivityArchive from 'features/campaigns/hooks/useActivityArchive';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import ZUIFuture from 'zui/ZUIFuture';
import { ACTIVITIES, CampaignActivity } from 'features/campaigns/types';

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
  }
);

interface SharedArchivePageProps {
  orgId: string;
}

const SharedArchivePage: PageWithLayout<SharedArchivePageProps> = ({
  orgId,
}) => {
  const messages = useMessages(messageIds);
  const onServer = useServerSide();
  const { campId } = useNumericRouteParams();
  const parsedOrgId = parseInt(orgId);
  const archivedActivities = useActivityArchive(parsedOrgId, campId);
  const [searchString, setSearchString] = useState('');
  const [filters, setFilters] = useState<ACTIVITIES[]>([
    ACTIVITIES.CALL_ASSIGNMENT,
    ACTIVITIES.SURVEY,
    ACTIVITIES.TASK,
    ACTIVITIES.EMAIL,
    ACTIVITIES.EVENT,
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

  return (
    <Box>
      <ZUIFuture future={archivedActivities} skeletonWidth={200}>
        {(activities) => {
          //It only filters shared surveys for now, but there will be more shared activities in the future.
          const data = activities.filter(
            (item) =>
              item.kind === 'survey' &&
              item.data.org_access === 'suborgs' &&
              item.data.organization.id != parsedOrgId
          );
          if (data.length === 0) {
            return (
              <ZUIEmptyState
                href={`/organize/${orgId}/projects/shared/activities`}
                linkMessage={messages.activitiesOverview.goToActivities()}
                message={messages.shared.noArchives()}
              />
            );
          }

          const activityTypes = data.map(
            (activity: CampaignActivity) => activity.kind
          );
          const filterTypes = [...new Set(activityTypes)];

          return (
            <Grid container spacing={2}>
              <Grid item sm={8}>
                <ActivityList
                  allActivities={data}
                  filters={filters}
                  orgId={parsedOrgId}
                  searchString={searchString}
                />
              </Grid>

              <Grid item sm={4}>
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

SharedArchivePage.getLayout = function getLayout(page, props) {
  return (
    <SharedActivitiesLayout orgId={props.orgId}>{page}</SharedActivitiesLayout>
  );
};

export default SharedArchivePage;
