import { Box } from '@mui/material';
import { FC } from 'react';
import {
  EventOutlined,
  Group,
  PlaceOutlined,
  ScheduleOutlined,
} from '@mui/icons-material';

import ActivityListItem from './ActivityListItem';
import { ClusteredEvent } from 'features/campaigns/hooks/useClusteredActivities';
import { EventWarningIconsSansModel } from 'features/events/components/EventWarningIcons';
import useEventClusterData from 'features/events/hooks/useEventClusterData';
import { useEventPopper } from 'features/events/components/EventPopper/EventPopperProvider';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';
import ZUITimeSpan from 'zui/ZUITimeSpan';

interface EventListeItemProps {
  cluster: ClusteredEvent;
}

const EventListItem: FC<EventListeItemProps> = ({ cluster }) => {
  const {
    allHaveContacts,
    color,
    endTime,
    location,
    numBooked,
    numParticipantsAvailable,
    numParticipantsRequired,
    numPending,
    numReminded,
    statsLoading,
    startTime,
    title,
  } = useEventClusterData(cluster);
  const { openEventPopper } = useEventPopper();

  return (
    <Box
      onClick={(evt) =>
        openEventPopper(cluster, { left: evt.clientX, top: evt.clientY })
      }
      sx={{ cursor: 'pointer' }}
    >
      <ActivityListItem
        color={color}
        endNumber={`${numParticipantsAvailable} / ${numParticipantsRequired}`}
        endNumberColor={
          numParticipantsAvailable < numParticipantsRequired
            ? 'error'
            : undefined
        }
        meta={
          <EventWarningIconsSansModel
            compact={false}
            hasContact={allHaveContacts}
            numParticipants={numBooked}
            numRemindersSent={numReminded}
            numSignups={numPending}
            participantsLoading={statsLoading}
          />
        }
        PrimaryIcon={EventOutlined}
        SecondaryIcon={Group}
        subtitle={
          <ZUIIconLabelRow
            color="secondary"
            iconLabels={[
              {
                icon: <ScheduleOutlined fontSize="inherit" />,
                label: (
                  <ZUITimeSpan
                    end={new Date(endTime)}
                    start={new Date(startTime)}
                  />
                ),
              },
              ...(location
                ? [
                    {
                      icon: <PlaceOutlined fontSize="inherit" />,
                      label: location.title,
                    },
                  ]
                : []),
            ]}
            size="sm"
          />
        }
        title={title}
      />
    </Box>
  );
};

export default EventListItem;
