import { FormattedTime } from 'react-intl';
import NextLink from 'next/link';
import { Box, Link, Typography, useTheme } from '@mui/material';
import { People, PlaceOutlined, Schedule } from '@mui/icons-material';

import EventSelectionCheckBox from 'features/events/components/EventSelectionCheckBox';
import EventWarningIcons from 'features/events/components/EventWarningIcons';
import getEventState from 'features/events/utils/getEventState';
import getEventUrl from 'features/events/utils/getEventUrl';
import { isAllDay } from '../../utils';
import messageIds from 'features/events/l10n/messageIds';
import { removeOffset } from 'utils/dateUtils';
import StatusDot from 'features/events/components/EventPopper/StatusDot';
import { truncateOnMiddle } from 'utils/stringUtils';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';

const Event = ({ event }: { event: ZetkinEvent }) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);

  const needsParticipants =
    event.num_participants_required > event.num_participants_available;

  return (
    <NextLink href={getEventUrl(event)} legacyBehavior passHref>
      <Link color="inherit" underline="none">
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          padding={2}
          sx={(theme) => ({
            backgroundColor:
              theme.palette.mode === 'dark' ? theme.palette.grey[800] : 'white',
            borderRadius: '3px',
          })}
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
              noWrap
              sx={{
                color: theme.palette.secondary.main,
              }}
            >
              {truncateOnMiddle(
                event.title ||
                  event.activity?.title ||
                  messages.common.noTitle(),
                50
              )}
            </Typography>
            {/* Time */}
            <Typography color={theme.palette.secondary.main} component={'div'}>
              <Box alignItems="center" display="flex" gap={0.5}>
                <Schedule />
                {isAllDay(event.start_time, event.end_time) ? (
                  <Typography key={event.id}>
                    {messages.common.allDay()}
                  </Typography>
                ) : (
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
                noWrap
              >
                <Box alignItems="center" display="flex" gap={0.5}>
                  <PlaceOutlined />
                  {truncateOnMiddle(event.location?.title, 40)}
                </Box>
              </Typography>
            )}
          </Box>
          {/* Icons */}
          <Box alignItems="center" display="flex" gap={1}>
            <EventWarningIcons
              compact
              eventId={event.id}
              orgId={event.organization.id}
            />
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
