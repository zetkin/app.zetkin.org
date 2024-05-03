import { FC } from 'react';
import NextLink from 'next/link';
import { Box, Button, Grid, Typography } from '@mui/material';

import ActivitiesOverviewCard from './ActivitiesOverviewCard';
import messageIds from 'features/campaigns/l10n/messageIds';
import useActivitiyOverview from 'features/campaigns/hooks/useActivityOverview';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import ZUIFuture from 'zui/ZUIFuture';
import { ActivityOverview, CampaignActivity } from 'features/campaigns/types';
import { Msg, useMessages } from 'core/i18n';

type ActivitiesOverviewProps = {
  campaignId?: number;
  isShared?: boolean;
  orgId: number;
};

const ActivitiesOverview: FC<ActivitiesOverviewProps> = ({
  campaignId,
  isShared,
  orgId,
}) => {
  const messages = useMessages(messageIds);
  const activityOverview = useActivitiyOverview(orgId, campaignId);

  const todayDate = new Date();
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  const filterSharedSurveys = (items: CampaignActivity[]) => {
    return items.filter(
      (item) =>
        item.kind === 'survey' &&
        item.data.org_access === 'suborgs' &&
        item.data.organization.id === orgId
    );
  };

  return (
    <>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        my={2}
      >
        <Box>
          <Typography variant="h4">
            <Msg id={messageIds.activitiesOverview.title} />
          </Typography>
        </Box>
        <Box>
          <NextLink
            href={`/organize/${orgId}/projects${
              campaignId ? `/${campaignId}` : ''
            }/activities`}
            legacyBehavior
            passHref
          >
            <Button variant="text">
              <Msg id={messageIds.activitiesOverview.button} />
            </Button>
          </NextLink>
        </Box>
      </Box>
      <ZUIFuture future={activityOverview}>
        {(activities) => {
          const data: ActivityOverview = isShared
            ? {
                alsoThisWeek: filterSharedSurveys(activities.alsoThisWeek),
                today: filterSharedSurveys(activities.today),
                tomorrow: filterSharedSurveys(activities.tomorrow),
              }
            : activities;

          const totalLength =
            data.today.length + data.tomorrow.length + data.alsoThisWeek.length;

          if (totalLength == 0) {
            return (
              <Box>
                <ZUIEmptyState
                  href={`/organize/${orgId}/projects${
                    campaignId ? `/${campaignId}` : ''
                  }/activities`}
                  linkMessage={messages.activitiesOverview.goToActivities()}
                  message={messages.activitiesOverview.noActivities()}
                />
              </Box>
            );
          }

          return (
            <Grid container spacing={2}>
              <Grid item md={4} xs={12}>
                <ActivitiesOverviewCard
                  activities={data.today}
                  campId={campaignId}
                  focusDate={todayDate}
                  header={messages.activitiesOverview.todayCard()}
                  orgId={orgId}
                  timeScale={'day'}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <ActivitiesOverviewCard
                  activities={data.tomorrow}
                  campId={campaignId}
                  focusDate={tomorrowDate}
                  header={messages.activitiesOverview.tomorrowCard()}
                  orgId={orgId}
                  timeScale={'day'}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <ActivitiesOverviewCard
                  activities={data.alsoThisWeek}
                  campId={campaignId}
                  focusDate={null}
                  header={messages.activitiesOverview.thisWeekCard()}
                  orgId={orgId}
                  timeScale={'week'}
                />
              </Grid>
            </Grid>
          );
        }}
      </ZUIFuture>
    </>
  );
};

export default ActivitiesOverview;
