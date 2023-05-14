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
import getEventUrl from 'features/events/utils/getEventUrl';
import { removeOffset } from 'utils/dateUtils';
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

  const event = cluster.events[0];

  return (
    <ActivityListItem
      color={color}
      endNumber={`${numParticipantsAvailable} / ${numParticipantsRequired}`}
      endNumberColor={
        numParticipantsAvailable < numParticipantsRequired ? 'error' : undefined
      }
      href={getEventUrl(event)}
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
      onEventItemClick={(x: number, y: number) => {
        openEventPopper(cluster, { left: x, top: y });
      }}
      PrimaryIcon={EventOutlined}
      SecondaryIcon={Group}
      subtitle={
        <ZUIIconLabelRow
          color="secondary"
          iconLabels={[
            {
              icon: <ScheduleOutlined color="secondary" fontSize="inherit" />,
              label: (
                <ZUITimeSpan
                  end={new Date(removeOffset(endTime))}
                  start={new Date(removeOffset(startTime))}
                />
              ),
            },
            ...(location
              ? [
                  {
                    icon: (
                      <PlaceOutlined color="secondary" fontSize="inherit" />
                    ),
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
  );
};

export default EventListItem;
