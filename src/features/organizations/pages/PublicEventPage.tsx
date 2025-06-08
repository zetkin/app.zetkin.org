'use client';

import { FC, Fragment, useMemo, useState } from 'react';
import { Box } from '@mui/system';
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

import { ZetkinOrganization, ZetkinUser } from 'utils/types/zetkin';
import useUser from 'core/hooks/useUser';
import { useOrgEvents } from '../hooks/useUpcomingOrgEvents';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import ZUIUserAvatar from 'zui/ZUIUserAvatar';
import ZUIText from 'zui/components/ZUIText';
import ZUIIcon from 'zui/components/ZUIIcon';
import { useEnv } from 'core/hooks';
import MarkerIcon from 'features/canvass/components/MarkerIcon';
import { ZUIMapControlButtonGroup } from 'zui/ZUIMapControls';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useMyEvents from 'features/events/hooks/useMyEvents';
import { ZetkinEventWithStatus } from 'features/home/types';
import { EventSignupButton } from 'features/home/components/EventSignupButton';
import ZUISignUpChip from 'zui/components/ZUISignUpChip';
import ZUIIconButton from 'zui/components/ZUIIconButton';

export const PublicEventPage: FC<{
  eventId: number;
  org: ZetkinOrganization;
}> = ({ eventId, org }) => {
  const events = useOrgEvents(org.id);
  const user = useUser();
  const myEvents = useMyEvents();

  const baseEvent = useMemo(
    () =>
      events
        .map((event) => ({
          ...event,
          status: null,
        }))
        .find((e) => e.id === eventId),
    [events, myEvents, eventId]
  );
  const myEvent = myEvents.find((userEvent) => userEvent.id == eventId);
  const event = myEvent || baseEvent;

  return (
    <>
      <HeaderSection event={event} org={org} user={user} />
      {event ? <BodySection event={event} /> : 'Not found'}
    </>
  );
};

export const HeaderSection: FC<{
  event: ZetkinEventWithStatus | undefined;
  org: ZetkinOrganization;
  user: ZetkinUser | null;
}> = ({ event, org, user }) => {
  const theme = useTheme();

  const projectName = event?.campaign?.title;
  const eventType = event?.activity?.title;

  const subheaderText = [projectName, eventType].filter(Boolean).join(', ');

  return (
    <Box sx={{ background: 'linear-gradient(to right, #6ADDD2, #B62993)' }}>
      <Box
        display="flex"
        flexDirection="column"
        gap={12}
        marginX="auto"
        maxWidth={960}
        sx={
          // Add background image if available, otherwise use a light overlay (only on desktop)
          event?.cover_file?.url
            ? {
                background: `url(${event.cover_file.url})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }
            : {
                [theme.breakpoints.up('md')]: {
                  background: 'rgba(0, 0, 0, 0.1)',
                },
              }
        }
      >
        <Box
          display="flex"
          justifyContent="space-between"
          padding={2}
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        >
          <Box alignItems="center" display="flex" gap={0.5}>
            <ZUIOrgLogoAvatar orgId={org.id} size="small" />
            <ZUIText variant="headingSm">{org.title}</ZUIText>
          </Box>
          {user ? <ZUIUserAvatar personId={user.id} size="sm" /> : null}
        </Box>
        <Box
          paddingX={2}
          paddingY={1}
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        >
          <ZUIText variant="headingLg">{event?.title}</ZUIText>
          {subheaderText && (
            <ZUIText variant="headingSm">{subheaderText}</ZUIText>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const BodySection: FC<{
  event: ZetkinEventWithStatus;
}> = ({ event }) => {
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
      display="flex"
      flexDirection="column"
      gap={3}
      marginX="auto"
      maxWidth={960}
      paddingX={2}
      paddingY={3}
    >
      <SignUpSection event={event} />
      <DateAndLocation event={event} />
      <Box display="flex" flexDirection="column" gap={1}>
        {paragraphs}
      </Box>
    </Box>
  );
};

const SignUpSection: FC<{
  event: ZetkinEventWithStatus;
}> = ({ event }) => {
  const hasContactMethods =
    event.status === 'booked' && (event.contact?.email || event.contact?.phone);
  const [expandContactMethods, setExpandContactMethods] = useState(false);

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
}> = ({ event }) => {
  const env = useEnv();

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
      <>
        <FormattedDate day="numeric" month="long" value={endDateTime} />,{' '}
        {endTime}
      </>
    );

    return (
      <>
        {from} — {to}
      </>
    );
  };

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Box alignItems="center" display="flex" gap={1}>
        <ZUIIcon icon={CalendarMonth} />{' '}
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
