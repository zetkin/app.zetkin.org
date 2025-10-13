'use client';

import { FC, Fragment, Suspense, useMemo, useState } from 'react';
import { Box } from '@mui/system';
import {
  CalendarMonth,
  EmailOutlined,
  ExpandLess,
  ExpandMore,
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
import useMyEvents from 'features/events/hooks/useMyEvents';
import ZUIPublicFooter from 'zui/components/ZUIPublicFooter';
import useEvent from 'features/events/hooks/useEvent';
import { removeOffset } from 'utils/dateUtils';

type Props = {
  eventId: number;
  orgId: number;
};

export const PublicEventPage: FC<Props> = ({ eventId, orgId }) => {
  const isMobile = useIsMobile();
  const myEvents = useMyEvents();

  const baseEvent = useEvent(orgId, eventId)?.data;
  const baseEventWithStatus: ZetkinEventWithStatus | undefined = baseEvent
    ? { ...baseEvent, status: null }
    : undefined;
  const myEvent = myEvents.find((userEvent) => userEvent.id == eventId);
  const event = myEvent || baseEventWithStatus;

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

  const contactPerson = event?.contact;
  const showContactDetails =
    !event?.cancelled && event?.status == 'booked' && !!contactPerson;

  const getFlexDirection = () => {
    if (isMobile) {
      return 'column-reverse';
    }

    if (!hasInfoText) {
      return 'column';
    }

    return 'row';
  };

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
            {/**TODO: figure out how to layout this properly for mobile and fullscreen without having this component apppear twice */}
            {isMobile && showContactDetails && (
              <ContactPersonSection contactPerson={contactPerson} />
            )}
            <Box
              sx={{
                display: 'flex',
                flexDirection: getFlexDirection(),
                gap: hasInfoText || (!hasInfoText && isFullScreen) ? 2 : 0,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: isFullScreen && hasInfoText ? 2 : 0,
                  width: isFullScreen && hasInfoText ? '60%' : '100%',
                }}
              >
                {isFullScreen && showContactDetails && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <ContactPersonSection contactPerson={contactPerson} />
                  </Box>
                )}
                {hasInfoText && (
                  <Box
                    bgcolor="white"
                    borderRadius={2}
                    minHeight={isFullScreen ? 400 : ''}
                    padding={2}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <Box display="flex" flexDirection="column" gap={1}>
                      {paragraphs}
                    </Box>
                  </Box>
                )}
              </Box>
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

const ContactPersonSection: FC<{
  contactPerson: { email?: string; id: number; name: string; phone?: string };
}> = ({ contactPerson }) => {
  const [expandContactMethods, setExpandContactMethods] = useState(false);

  const hasContactMethods =
    'email' in contactPerson || 'phone' in contactPerson;

  return (
    <Box bgcolor="white" borderRadius={2} padding={2}>
      <Box alignItems="center" display="flex" gap={1}>
        <ZUIPersonAvatar
          firstName={contactPerson.name.split(' ')[0]}
          id={contactPerson.id}
          lastName={contactPerson.name.split(' ')[1]}
        />
        <ZUIText variant="bodyMdSemiBold">
          <Msg
            id={messageIds.eventPage.contactPerson}
            values={{ name: contactPerson.name }}
          />
        </ZUIText>
        {hasContactMethods && (
          <Box marginLeft="auto">
            <ZUIIconButton
              icon={expandContactMethods ? ExpandLess : ExpandMore}
              onClick={() => setExpandContactMethods(!expandContactMethods)}
              size="small"
            />
          </Box>
        )}
      </Box>
      {hasContactMethods && expandContactMethods && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            paddingTop: 1,
          }}
        >
          {contactPerson.phone && (
            <Box alignItems="center" display="flex" gap={1}>
              <ZUIIcon icon={Phone} size="small" />
              <ZUIText variant="bodySmRegular">{contactPerson.phone}</ZUIText>
            </Box>
          )}
          {contactPerson.email && (
            <Box alignItems="center" display="flex" gap={1}>
              <ZUIIcon icon={EmailOutlined} size="small" />
              <ZUIText variant="bodySmRegular">{contactPerson.email}</ZUIText>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

const SignUpSection: FC<{
  event: ZetkinEventWithStatus;
}> = ({ event }) => {
  const messages = useMessages(messageIds);

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
        <Box alignItems="center" display="flex" gap={1}>
          <ZUIButton
            disabled
            label={messages.eventPage.cancelSignup()}
            variant="secondary"
          />
          <ZUISignUpChip status="booked" />
        </Box>
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
  const startTime = useMemo(
    () => new Date(removeOffset(event.start_time)),
    [event]
  );
  const endTime = useMemo(
    () => new Date(removeOffset(event.end_time)),
    [event]
  );

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
          <ZUITimeSpan end={endTime} start={startTime} />
        </ZUIText>
      </Box>
      {event.url && (
        <Box alignItems="center" display="flex" gap={1}>
          <ZUIIcon icon={LinkIcon} />
          <ZUILink href={event.url} openInNewTab text={event.url} />
        </Box>
      )}
      {event.location && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box alignItems="center" display="flex" gap={1}>
            <ZUIIcon icon={LocationPin} />
            {}
            <ZUILink
              href={`https://www.google.com/maps?q=${event.location.lat.toFixed(
                4
              )},${event.location.lng.toFixed(4)}(${encodeURIComponent(
                event.location.title
              )})`}
              openInNewTab={true}
              text={event.location.title}
            />
          </Box>
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
      )}
    </Box>
  );
};
