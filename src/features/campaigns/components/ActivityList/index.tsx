import { FilterListOutlined, Pending } from '@mui/icons-material';
import Fuse from 'fuse.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, BoxProps, Card, Divider, Typography } from '@mui/material';

import CallAssignmentListItem from './items/CallAssignmentListItem';
import EmailListItem from './items/EmailListItem';
import EventClusterListItem from './items/EventClusterListItem';
import EventListItem from './items/EventListItem';
import isEventCluster from 'features/campaigns/utils/isEventCluster';
import messageIds from 'features/campaigns/l10n/messageIds';
import SurveyListItem from './items/SurveyListItem';
import TaskListItem from './items/TaskListItem';
import { useMessages } from 'core/i18n';
import { ACTIVITIES, CampaignActivity } from 'features/campaigns/types';
import useClusteredActivities, {
  CLUSTER_TYPE,
} from 'features/campaigns/hooks/useClusteredActivities';
import CanvassAssignmentListItem from './items/CanvassAssignmentListItem';
import ActivityListItem, { STATUS_COLORS } from './items/ActivityListItem';

interface ActivitiesProps {
  activities: CampaignActivity[];
  orgId: number;
}

interface LazyActivitiesBoxProps extends BoxProps {
  index: number;
}

const LazyActivitiesBox = ({
  index,
  children,
  ...props
}: LazyActivitiesBoxProps) => {
  const [inView, setInView] = useState(false);
  const boxRef = useRef<HTMLElement>();

  useEffect(() => {
    if (!boxRef.current) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      });
    });

    observer.observe(boxRef.current);
  }, [boxRef]);

  return inView ? (
    <Box {...props}>
      {index > 0 && <Divider />}
      {children}
    </Box>
  ) : (
    <Box ref={boxRef}>
      {index > 0 && <Divider />}
      <ActivityListItem
        color={STATUS_COLORS.GRAY}
        endNumber={0}
        href={'#'}
        PrimaryIcon={Pending}
        SecondaryIcon={Pending}
        title={'...'}
      />
    </Box>
  );
};

const Activities = ({ activities, orgId }: ActivitiesProps) => {
  const clustered = useClusteredActivities(activities);

  return (
    <Card>
      {clustered.map((activity, index) => {
        if (activity.kind === ACTIVITIES.CALL_ASSIGNMENT) {
          return (
            <LazyActivitiesBox key={`ca-${activity.data.id}`} index={index}>
              <CallAssignmentListItem caId={activity.data.id} orgId={orgId} />
            </LazyActivitiesBox>
          );
        } else if (activity.kind == ACTIVITIES.CANVASS_ASSIGNMENT) {
          return (
            <LazyActivitiesBox
              key={`canvassassignment-${activity.data.id}`}
              index={index}
            >
              <CanvassAssignmentListItem
                caId={activity.data.id}
                orgId={orgId}
              />
            </LazyActivitiesBox>
          );
        } else if (isEventCluster(activity)) {
          return (
            <LazyActivitiesBox
              key={`event-${activity.events[0].id}`}
              index={index}
            >
              {activity.kind == CLUSTER_TYPE.SINGLE ? (
                <EventListItem cluster={activity} />
              ) : (
                <EventClusterListItem cluster={activity} />
              )}
            </LazyActivitiesBox>
          );
        } else if (activity.kind === ACTIVITIES.SURVEY) {
          return (
            <LazyActivitiesBox key={`survey-${activity.data.id}`} index={index}>
              <SurveyListItem orgId={orgId} surveyId={activity.data.id} />
            </LazyActivitiesBox>
          );
        } else if (activity.kind === ACTIVITIES.TASK) {
          return (
            <LazyActivitiesBox key={`task-${activity.data.id}`} index={index}>
              <TaskListItem orgId={orgId} taskId={activity.data.id} />
            </LazyActivitiesBox>
          );
        } else if (activity.kind === ACTIVITIES.EMAIL) {
          return (
            <LazyActivitiesBox key={`email-${activity.data.id}`} index={index}>
              <EmailListItem emailId={activity.data.id} orgId={orgId} />
            </LazyActivitiesBox>
          );
        }
      })}
    </Card>
  );
};

interface ActivityListProps {
  allActivities: CampaignActivity[];
  filters: ACTIVITIES[];
  orgId: number;
  searchString: string;
}

const ActivityList = ({
  allActivities,
  filters,
  orgId,
  searchString,
}: ActivityListProps) => {
  const messages = useMessages(messageIds);

  const searchResults = useMemo(() => {
    const filteredActivities = allActivities.filter((activity) =>
      filters.includes(activity.kind)
    );

    const fuse = new Fuse(filteredActivities, {
      keys: ['data.title'],
      threshold: 0.4,
    });

    return searchString
      ? fuse.search(searchString).map((fuseResult) => fuseResult.item)
      : filteredActivities;
  }, [searchString, filters, allActivities]);

  return (
    <>
      {searchResults.length > 0 && (
        <Activities activities={searchResults} orgId={orgId} />
      )}
      {!searchResults.length && (
        <Box alignItems="center" display="flex" flexDirection="column">
          <FilterListOutlined color="secondary" sx={{ fontSize: '12em' }} />
          <Typography color="secondary">
            {messages.singleProject.noSearchResults()}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default ActivityList;
