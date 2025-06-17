'use client';

import { FC, Fragment, Suspense, useMemo, useState } from 'react';
import { Box } from '@mui/system';
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
import Image from 'next/image';

import ZUIText from 'zui/components/ZUIText';
import ZUIIcon from 'zui/components/ZUIIcon';
import { useEnv } from 'core/hooks';
import MarkerIcon from 'features/canvass/components/MarkerIcon';
import { ZUIMapControlButtonGroup } from 'zui/ZUIMapControls';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { ZetkinEventWithStatus } from 'features/home/types';
import { EventSignupButton } from 'features/home/components/EventSignupButton';
import ZUISignUpChip from 'zui/components/ZUISignUpChip';
import ZUIIconButton from 'zui/components/ZUIIconButton';
import ZUIAlert from 'zui/components/ZUIAlert';
import ZUITimeSpan from 'zui/ZUITimeSpan';
import useIsMobile from 'utils/hooks/useIsMobile';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import ZUILink from 'zui/components/ZUILink';
import ZUIButton from 'zui/components/ZUIButton';
import { useOrgEvents } from '../hooks/useUpcomingOrgEvents';
import useMyEvents from 'features/events/hooks/useMyEvents';
import ZUIPublicFooter from 'zui/components/ZUIPublicFooter';

type Props = {
  eventId: number;
  orgId: number;
};

export const PublicEventPage: FC<Props> = ({ eventId, orgId }) => {
  const isMobile = useIsMobile();

  const events = useOrgEvents(orgId);
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

  // Split info_text into parapgraphs based on double newlines
  // and then turn single newlines into <br /> tags
  const paragraphs = event?.info_text
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

  const hasInfoText = !!event?.info_text;
  const hasImage = !!event?.cover_file;

  const isFullScreen = !isMobile;

  return (
    <Suspense>
      {event && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingX: isMobile ? 2 : '',
            position: 'relative',
          }}
        >
          {event.cover_file && (
            <Box
              sx={{
                '& img': {
                  maskImage: isFullScreen
                    ? ' linear-gradient(black 70%, transparent 100%)'
                    : '',
                  webkitMaskImage: isFullScreen
                    ? 'linear-gradient(black 70%, transparent 100%)'
                    : '',
                },
                height: isMobile ? 200 : 450,
                marginY: isMobile ? 2 : '',
                width: '100%',
              }}
            >
              <Image
                alt=""
                height={480}
                src={event.cover_file.url}
                style={{
                  height: '100%',
                  objectFit: 'cover',
                  width: '100%',
                }}
                width={960}
              />
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              marginTop: isFullScreen && !hasImage ? 3 : '',
              paddingX: isFullScreen && hasImage ? 3 : '',
              position: isFullScreen && hasImage ? 'absolute' : '',
              top: isFullScreen && hasImage ? 130 : '',
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column-reverse' : 'row',
                gap: 2,
              }}
            >
              {hasInfoText && (
                <Box
                  bgcolor="white"
                  borderRadius={2}
                  minHeight={isFullScreen ? 400 : ''}
                  padding={2}
                  width={isFullScreen ? '60%' : '100%'}
                >
                  <Box display="flex" flexDirection="column" gap={1}>
                    {paragraphs}
                  </Box>
                </Box>
              )}
              <Box
                bgcolor="white"
                borderRadius={2}
                display="flex"
                flexDirection="column"
                gap={2}
                minHeight={isFullScreen ? 400 : ''}
                padding={2}
                width={isFullScreen && hasInfoText ? '40%' : '100%'}
              >
                <SignUpSection event={event} />
                <DateAndLocation event={event} />
              </Box>
            </Box>
            <ZUIPublicFooter />
          </Box>
        </Box>
      )}
    </Suspense>
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
      {event.status == 'booked' && (
        <>
          <Box alignItems="center" display="flex" gap={1}>
            <ZUIButton
              disabled
              label={messages.eventPage.cancelSignup()}
              variant="secondary"
            />
            <ZUISignUpChip status="booked" />
          </Box>
          {event.contact && (
            <>
              <Box alignItems="center" display="flex" gap={1}>
                <ZUIPersonAvatar
                  firstName={event.contact.name.split(' ')[0]}
                  id={event.contact.id}
                  lastName={event.contact.name.split(' ')[1]}
                />
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
  const isMobile = useIsMobile();

  return (
    <Box display="flex" flexDirection="column" gap={isMobile ? 1 : 2}>
      {event.campaign && (
        <ZUIText>
          <Msg
            id={messageIds.eventPage.partOfProject}
            values={{
              projectLink: (
                <ZUILink
                  href={`/o/${event.organization.id}/projects/${event.campaign.id}`}
                  text={event.campaign.title}
                />
              ),
            }}
          />
        </ZUIText>
      )}
      <Box alignItems="center" display="flex" gap={1}>
        <ZUIIcon icon={CalendarMonth} />
        <ZUIText>
          <ZUITimeSpan
            end={new Date(event.end_time)}
            start={new Date(event.start_time)}
          />
        </ZUIText>
      </Box>
      {event.url && (
        <Box alignItems="center" display="flex" gap={1}>
          <ZUIIcon icon={LinkIcon} />
          <ZUILink href={event.url} openInNewTab text={event.url} />
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
              <ZUIIconButton
                href={`https://www.openstreetmap.org/directions?from=&to=${event.location.lat}%2C${event.location.lng}#map=14/${event.location.lat}/${event.location.lng}`}
                icon={Fullscreen}
              />
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
