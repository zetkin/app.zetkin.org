import { FC } from 'react';
import { FlagOutlined } from '@mui/icons-material';
import NextLink from 'next/link';
import { Box, Divider, Link } from '@mui/material';

import CallAssignmentOverviewListItem from './items/CallAssignmentOverviewListItem';
import EmailOverviewListItem from './items/EmailOverviewListItem';
import EventClusterOverviewListItem from './items/EventClusterOverviewListItem';
import EventOverviewListItem from './items/EventOverviewListItem';
import isEventCluster from 'features/campaigns/utils/isEventCluster';
import messageIds from 'features/campaigns/l10n/messageIds';
import SurveyOverviewListItem from './items/SurveyOverviewListItem';
import TaskOverviewListItem from './items/TaskOverviewListItem';
import ZUICard from 'zui/ZUICard';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import { ACTIVITIES, CampaignActivity } from 'features/campaigns/types';
import { Msg, useMessages } from 'core/i18n';
import useClusteredActivities, {
  CLUSTER_TYPE,
} from 'features/campaigns/hooks/useClusteredActivities';
import AreaAssignmentOverviewListItem from './items/AreaAssignmentOverviewListItem';

type OverviewListProps = {
  activities: CampaignActivity[];
  campId: number | undefined;
  focusDate: Date | null;
  header: string;
  orgId: number;
  timeScale: 'day' | 'week';
};

const ActivitiesOverviewCard: FC<OverviewListProps> = ({
  activities,
  campId,
  focusDate,
  header,
  orgId,
  timeScale,
}) => {
  const messages = useMessages(messageIds);
  const clustered = useClusteredActivities(activities);
  const truncActivities = clustered.slice(0, 6);
  const numExtra = clustered.length - truncActivities.length;

  const focusedDate = focusDate?.toISOString().split('T')[0];

  return (
    <ZUICard header={header}>
      {clustered.length === 0 && (
        <ZUIEmptyState
          message={messages.activitiesOverview.empty()}
          renderIcon={(props) => <FlagOutlined {...props} />}
        />
      )}
      {truncActivities.map((activity, index) => {
        if (activity.kind === ACTIVITIES.CALL_ASSIGNMENT) {
          return (
            <Box key={`ca-${activity.data.id}`}>
              {index > 0 && <Divider />}
              <CallAssignmentOverviewListItem
                activity={activity}
                focusDate={focusDate}
              />
            </Box>
          );
        } else if (activity.kind === ACTIVITIES.AREA_ASSIGNMENT) {
          return (
            <Box key={`ca-${activity.data.id}`}>
              {index > 0 && <Divider />}
              <AreaAssignmentOverviewListItem
                activity={activity}
                focusDate={focusDate}
              />
            </Box>
          );
        } else if (isEventCluster(activity)) {
          return (
            <Box key={`cluster-${activity.events[0].id}`}>
              {index > 0 && <Divider />}
              {activity.kind == CLUSTER_TYPE.SINGLE ? (
                <EventOverviewListItem
                  event={activity.events[0]}
                  focusDate={focusDate}
                />
              ) : (
                <EventClusterOverviewListItem
                  cluster={activity}
                  focusDate={focusDate}
                />
              )}
            </Box>
          );
        } else if (activity.kind === ACTIVITIES.SURVEY) {
          return (
            <Box key={`survey-${activity.data.id}`}>
              {index > 0 && <Divider />}
              <SurveyOverviewListItem
                activity={activity}
                focusDate={focusDate}
              />
            </Box>
          );
        } else if (activity.kind === ACTIVITIES.TASK) {
          return (
            <Box key={`task-${activity.data.id}`}>
              {index > 0 && <Divider />}
              <TaskOverviewListItem activity={activity} focusDate={focusDate} />
            </Box>
          );
        } else if (activity.kind === ACTIVITIES.EMAIL) {
          return (
            <Box key={`email-${activity.data.id}`}>
              {index > 0 && <Divider />}
              <EmailOverviewListItem
                activity={activity}
                focusDate={focusDate}
              />
            </Box>
          );
        }
      })}
      {numExtra > 0 && (
        <NextLink
          href={`/organize/${orgId}/projects${
            campId ? `/${campId}` : ''
          }/calendar?focusDate=${focusedDate}&timeScale=${timeScale}`}
          legacyBehavior
          passHref
        >
          <Link underline="none" variant="button">
            <Box textAlign="center">
              <Msg
                id={messageIds.activitiesOverview.extraActivities}
                values={{ numExtra }}
              />
            </Box>
          </Link>
        </NextLink>
      )}
    </ZUICard>
  );
};

export default ActivitiesOverviewCard;
