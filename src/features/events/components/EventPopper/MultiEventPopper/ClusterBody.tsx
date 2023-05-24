import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { People, PlaceOutlined, ScheduleOutlined } from '@mui/icons-material';

import { CLUSTER_TYPE } from 'features/campaigns/hooks/useClusteredActivities';
import EventSelectionCheckBox from '../../EventSelectionCheckBox';
import LocationLabel from '../../LocationLabel';
import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIIconLabel from 'zui/ZUIIconLabel';
import ZUITimeSpan from 'zui/ZUITimeSpan';

interface ClusterBodyProps {
  clusterType: CLUSTER_TYPE;
  events: ZetkinEvent[];
}

const ClusterBody: FC<ClusterBodyProps> = ({ clusterType, events }) => {
  const messages = useMessages(messageIds);

  const totalParticipantsAvailable = events
    .map((event) => event.num_participants_available)
    .reduce((sum, value) => sum + value);
  const totalParticipantsRequired = events
    .map((event) => event.num_participants_required)
    .reduce((sum, value) => sum + value);

  let type = messages.eventPopper.locations();
  if (clusterType === CLUSTER_TYPE.MULTI_SHIFT) {
    type = messages.eventPopper.shifts();
  } else if (clusterType === CLUSTER_TYPE.ARBITRARY) {
    type = messages.eventPopper.events();
  }

  return (
    <>
      <Box display="flex" flexDirection="column" paddingTop={2}>
        <Box alignItems="center" display="flex">
          <ScheduleOutlined color="secondary" fontSize="small" />
          <Typography color="secondary" paddingLeft={1} variant="body2">
            <ZUITimeSpan
              end={new Date(events[events.length - 1].end_time)}
              start={new Date(events[0].start_time)}
            />
          </Typography>
        </Box>
        {clusterType === CLUSTER_TYPE.MULTI_SHIFT && (
          <Box alignItems="center" display="flex">
            <PlaceOutlined color="secondary" fontSize="small" />
            <Typography color="secondary" paddingLeft={1} variant="body2">
              <LocationLabel location={events[0].location} />
            </Typography>
          </Box>
        )}
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        paddingBottom={1}
        paddingTop={2}
      >
        <Box alignItems="center" display="flex">
          <EventSelectionCheckBox events={events.map((event) => event.id)} />
          <Typography
            color="secondary"
            paddingLeft={1}
            variant="body2"
          >{`${events.length} ${type}`}</Typography>
        </Box>
        <Box paddingRight={5}>
          <ZUIIconLabel
            color={
              totalParticipantsAvailable < totalParticipantsRequired
                ? 'error'
                : 'secondary'
            }
            icon={
              <People
                color={
                  totalParticipantsAvailable < totalParticipantsRequired
                    ? 'error'
                    : 'secondary'
                }
                fontSize="small"
              />
            }
            label={`${totalParticipantsAvailable}/${totalParticipantsRequired}`}
            size="sm"
          />
        </Box>
      </Box>
    </>
  );
};

export default ClusterBody;
