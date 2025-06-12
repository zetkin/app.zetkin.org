'use client';

import { FC, Fragment, useState } from 'react';
import { Box, useMediaQuery } from '@mui/system';
import { Button, Link, useTheme } from '@mui/material';
import {
  CalendarMonth,
  EmailOutlined,
  ExpandLess,
  ExpandMore,
  Fullscreen,
  Link as LinkIcon,
  LocationPin,
  Phone,
} from '@mui/icons-material';
import { Map, Marker } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import dayjs from 'dayjs';
import { FormattedDate } from 'react-intl';

import ZUIUserAvatar from 'zui/ZUIUserAvatar';
import ZUIText from 'zui/components/ZUIText';
import ZUIIcon from 'zui/components/ZUIIcon';
import { useEnv } from 'core/hooks';
import MarkerIcon from 'features/canvass/components/MarkerIcon';
import { ZUIMapControlButtonGroup } from 'zui/ZUIMapControls';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useMyEvents from 'features/events/hooks/useMyEvents';
import { ZetkinEventWithStatus } from 'features/home/types';
import { EventSignupButton } from 'features/home/components/EventSignupButton';
import ZUISignUpChip from 'zui/components/ZUISignUpChip';
import ZUIIconButton from 'zui/components/ZUIIconButton';
import ZUIAlert from 'zui/components/ZUIAlert';

export const PublicEventPage: FC<{
  baseEvent: ZetkinEventWithStatus;
}> = ({ baseEvent }) => {
  const theme = useTheme();
  const myEvents = useMyEvents();

  const myEvent = myEvents.find((userEvent) => userEvent.id == baseEvent.id);
  const event = myEvent || baseEvent;

  // Split info_text into parapgraphs based on double newlines
  // and then turn single newlines into <br /> tags
  const paragraphs = event.info_text
    ?.split('\n\n')
    .filter((p) => p.trim() !== '')
    .map((p, index) => {
      return (
        <ZUIText key={index}>
          {p.split('\n').map((line, index) => {
            return (
              <Fragment key={index}>
                {index > 0 && <br />}
                {line}
              </Fragment>
            );
          })}
        </ZUIText>
      );
    });

  return (
    <Box
      display="grid"
      gap={3}
      marginX="auto"
      maxWidth={960}
      paddingX={2}
      paddingY={3}
      sx={{
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto auto auto',
        // On desktop, the date and location section is on the right side
        [theme.breakpoints.up('md')]: {
          gridTemplateColumns: '1fr 20rem',
          gridTemplateRows: 'auto auto',
        },
      }}
    >
      <SignUpSection event={event} />
      <DateAndLocation
        event={event}
        sx={{ [theme.breakpoints.up('md')]: { gridRow: 'span 2' } }}
      />
      <Box display="flex" flexDirection="column" gap={1}>
        {paragraphs}
      </Box>
    </Box>
  );
};

const SignUpSection: FC<{
  event: ZetkinEventWithStatus;
}> = ({ event }) => {
  const [expandContactMethods, setExpandContactMethods] = useState(false);
  const messages = useMessages(messageIds);

  const hasContactMethods =
    event.status === 'booked' && (event.contact?.email || event.contact?.phone);

  if (event.cancelled) {
    return (
      <ZUIAlert
        description={messages.eventPage.cancelledParagraph()}
        severity="warning"
        title={messages.eventPage.cancelledHeader()}
      />
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      {event.status === 'booked' && (
        <>
          <Box alignItems="center" display="flex" gap={1}>
            <Button color="secondary" disabled variant="outlined">
              <Msg id={messageIds.eventPage.cancelSignup} />
            </Button>
            <ZUISignUpChip status="booked" />
          </Box>
          {event.contact && (
            <>
              <Box alignItems="center" display="flex" gap={1}>
                <ZUIUserAvatar personId={event.contact.id} size="sm" />
                <ZUIText variant="bodyMdSemiBold">
                  <Msg
                    id={messageIds.eventPage.contactPerson}
                    values={{ name: event.contact.name }}
                  />
                </ZUIText>
                {hasContactMethods && (
                  <Box marginLeft="auto">
                    <ZUIIconButton
                      icon={expandContactMethods ? ExpandLess : ExpandMore}
                      onClick={() =>
                        setExpandContactMethods(!expandContactMethods)
                      }
                      size="small"
                    />
                  </Box>
                )}
              </Box>
              {hasContactMethods && expandContactMethods && (
                <>
                  {event.contact.phone && (
                    <Box alignItems="center" display="flex" gap={1}>
                      <ZUIIcon icon={Phone} size="small" />
                      <ZUIText variant="bodyMdRegular">
                        {event.contact.phone}
                      </ZUIText>
                    </Box>
                  )}
                  {event.contact.email && (
                    <Box alignItems="center" display="flex" gap={1}>
                      <ZUIIcon icon={EmailOutlined} size="small" />
                      <ZUIText variant="bodyMdRegular">
                        {event.contact.email}
                      </ZUIText>
                    </Box>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
      <Box alignItems="center" display="flex" gap={1}>
        <EventSignupButton event={event} />
      </Box>
    </Box>
  );
};

const DateAndLocation: FC<{
  event: ZetkinEventWithStatus;
  sx: React.CSSProperties;
}> = ({ event, sx }) => {
  const env = useEnv();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const formatDate = (startDateTime: string, endDateTime: string) => {
    const sameDay = dayjs(startDateTime).isSame(dayjs(endDateTime), 'day');
    const startedToday = dayjs(startDateTime).isSame(dayjs(), 'day');

    const startTime = dayjs(startDateTime).format('HH:mm');
    const endTime = !!endDateTime && dayjs(endDateTime).format('HH:mm');

    const from = startedToday ? (
      <>
        <Msg id={messageIds.eventPage.today} />, {startTime}
      </>
    ) : (
      <>
        <FormattedDate day="numeric" month="long" value={startDateTime} />,{' '}
        {startTime}
      </>
    );
    if (!endTime) {
      return from;
    }

    const to = sameDay ? (
      endTime
    ) : (
      <ZUIText>
        <FormattedDate day="numeric" month="long" value={endDateTime} />,{' '}
        {endTime}
      </ZUIText>
    );

    return (
      <ZUIText>
        {from} — {to}
      </ZUIText>
    );
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={isMobile ? 1 : 2}
      sx={{ ...sx }}
    >
      <Box alignItems="center" display="flex" gap={1}>
        <ZUIIcon icon={CalendarMonth} />
        {formatDate(event.start_time, event.end_time)}
      </Box>
      {event.url && (
        <Box alignItems="center" display="flex" gap={1}>
          <ZUIIcon icon={LinkIcon} />
          <Link href={event.url} rel="noopener noreferrer" target="_blank">
            {event.url}
          </Link>
        </Box>
      )}
      {event.location && (
        <>
          <Box alignItems="center" display="flex" gap={1}>
            <ZUIIcon icon={LocationPin} />
            <ZUIText variant="bodyMdSemiBold">{event.location.title}</ZUIText>
          </Box>
          <Box sx={{ position: 'relative' }}>
            <ZUIMapControlButtonGroup>
              <Button
                // TODO: Handle full-screen map better. (open app? open modal?)
                href={`https://www.openstreetmap.org/directions?from=&to=${event.location.lat}%2C${event.location.lng}#map=14/${event.location.lat}/${event.location.lng}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Fullscreen />
              </Button>
            </ZUIMapControlButtonGroup>
            <Map
              initialViewState={{
                latitude: event.location.lat,
                longitude: event.location.lng,
                zoom: 14,
              }}
              mapStyle={env.vars.MAPLIBRE_STYLE}
              onClick={(ev) => {
                ev.target.panTo(ev.lngLat, { animate: true });
              }}
              style={{ height: 200, width: '100%' }}
            >
              <Marker
                anchor="bottom"
                draggable={false}
                latitude={event.location.lat}
                longitude={event.location.lng}
                offset={[0, 6]}
              >
                <MarkerIcon color="#000000" selected />
              </Marker>
            </Map>
          </Box>
        </>
      )}
    </Box>
  );
};
