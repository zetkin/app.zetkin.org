import { FormattedTime } from 'react-intl';
import NextLink from 'next/link';
import { Box, Link, Typography } from '@mui/material';
import { People, PlaceOutlined, Schedule } from '@mui/icons-material';

import EventDataModel from 'features/events/models/EventDataModel';
import EventSelectionCheckBox from 'features/events/components/EventSelectionCheckBox';
import EventWarningIcons from 'features/events/components/EventWarningIcons';
import getEventState from 'features/events/utils/getEventState';
import getEventUrl from 'features/events/utils/getEventUrl';
import messageIds from 'features/events/l10n/messageIds';
import { removeOffset } from 'utils/dateUtils';
import StatusDot from 'features/events/components/EventPopper/StatusDot';
import theme from 'theme';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import { ZetkinEvent } from 'utils/types/zetkin';

const Event = ({ event }: { event: ZetkinEvent }) => {
  const messages = useMessages(messageIds);
  const model = useModel(
    (env) => new EventDataModel(env, event.organization.id, event.id)
  );

  const needsParticipants =
    event.num_participants_required > event.num_participants_available;

  function isAllDay(event: ZetkinEvent): boolean {
    const startDate = new Date(removeOffset(event.start_time));
    const endDate = new Date(removeOffset(event.end_time));

    // Check if the start and end dates are not on the same day
    if (startDate.toDateString() !== endDate.toDateString()) {
      // If start time and end time are 00:00:00 return true
      if (
        startDate.toString().split(' ')[4] == '00:00:00' &&
        endDate.toString().split(' ')[4] == '00:00:00'
      ) {
        return true;
      }
    }
    return false;
  }

  return (
    <NextLink href={getEventUrl(event)} passHref>
      <Link color="inherit" underline="none">
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          padding={2}
          sx={{ backgroundColor: 'white', borderRadius: '3px' }}
          width="100%"
        >
          <Box alignItems="center" display="flex" gap={2.2}>
            <Box sx={{ ml: 2, pb: 0.1 }}>
              <EventSelectionCheckBox events={[event]} />
            </Box>
            {/* Status */}
            <StatusDot state={getEventState(event)} />
            {/* Title */}
            <Typography
              sx={{
                color: theme.palette.secondary.main,
              }}
            >
              {event.title ||
                event.activity?.title ||
                messages.common.noTitle()}
            </Typography>
            {/* Time */}
            <Typography color={theme.palette.secondary.main} component={'div'}>
              <Box alignItems="center" display="flex" gap={0.5}>
                <Schedule />
                {isAllDay(event) && (
                  <Typography key={event.id}>
                    {messages.common.allDay()}
                  </Typography>
                )}
                {!isAllDay(event) && (
                  <>
                    <FormattedTime
                      hour="numeric"
                      hour12={false}
                      minute="numeric"
                      value={removeOffset(event.start_time)}
                    />
                    &nbsp;-&nbsp;
                    <FormattedTime
                      hour="numeric"
                      hour12={false}
                      minute="numeric"
                      value={removeOffset(event.end_time)}
                    />
                  </>
                )}
              </Box>
            </Typography>
            {/* Location */}
            {event.location && (
              <Typography
                color={theme.palette.secondary.main}
                component={'div'}
              >
                <Box alignItems="center" display="flex" gap={0.5}>
                  <PlaceOutlined />
                  {event.location?.title}
                </Box>
              </Typography>
            )}
          </Box>
          {/* Icons */}
          <Box alignItems="center" display="flex" gap={1}>
            <EventWarningIcons compact model={model} />
            <People color={needsParticipants ? 'error' : 'secondary'} />
            <Typography color={needsParticipants ? 'error' : 'secondary'}>
              {event.num_participants_available}/
              {event.num_participants_required}
            </Typography>
          </Box>
        </Box>
      </Link>
    </NextLink>
  );
};

export default Event;
