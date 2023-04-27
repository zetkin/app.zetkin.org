import { FC } from 'react';
import { Box, Checkbox, Divider, Typography } from '@mui/material';
import { People, PlaceOutlined, ScheduleOutlined } from '@mui/icons-material';

import { EventState } from 'features/events/models/EventDataModel';
import LocationName from '../LocationName';
import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIIconLabel from 'zui/ZUIIconLabel';
import ZUITimeSpan from 'zui/ZUITimeSpan';
import MultiEventListItem, { CLUSTER_TYPE } from './MultiEventListItem';

interface MultiShiftEventProps {
  events: ZetkinEvent[];
}

const MultiShiftEvent: FC<MultiShiftEventProps> = ({ events }) => {
  const messages = useMessages(messageIds);
  const totalParticipantsAvailable = events
    .map((event) => event.num_participants_available)
    .reduce((sum, value) => sum + value);
  const totalParticipantsRequired = events
    .map((event) => event.num_participants_required)
    .reduce((sum, value) => sum + value);
  return (
    <Box>
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
        <Box alignItems="center" display="flex">
          <PlaceOutlined color="secondary" fontSize="small" />
          <Typography color="secondary" paddingLeft={1} variant="body2">
            <LocationName location={events[0].location} />
          </Typography>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        paddingBottom={1}
        paddingTop={2}
      >
        <Box alignItems="center" display="flex">
          <Checkbox sx={{ padding: '0px' }} />
          <Typography color="secondary" paddingLeft={1} variant="body2">{`${
            events.length
          } ${messages.eventPopper.shifts()}`}</Typography>
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
      <Divider />
      <Box paddingTop={1}>
        {events.map((event) => {
          return (
            <MultiEventListItem
              key={event.id}
              clusterType={CLUSTER_TYPE.SHIFT}
              compact={false}
              event={event}
              participants={[]}
              state={EventState.OPEN}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default MultiShiftEvent;
