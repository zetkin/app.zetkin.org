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
  Person,
  Phone,
} from '@mui/icons-material';
import { Map, Marker } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

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
import useUserMemberships from 'features/home/hooks/useUserMemberships';
import useUser from 'core/hooks/useUser';
import { PublicEventSignup } from '../components/PublicEventSignup';
import useFeatureWithOrg from 'utils/featureFlags/useFeatureWithOrg';
import { UNAUTH_EVENT_SIGNUP } from 'utils/featureFlags';

type Props = {
  eventId: number;
  orgId: number;
};

export const PublicEventPage: FC<Props> = ({ eventId, orgId }) => {
  const isMobile = useIsMobile();
  const messages = useMessages(messageIds);
  const myEvents = useMyEvents();
  const userMemberships = useUserMemberships();
  const baseEvent = useEvent(orgId, eventId)?.data;
  const baseEventWithStatus: ZetkinEventWithStatus | undefined = baseEvent
    ? { ...baseEvent, status: null }
    : undefined;
  const myEvent = myEvents.find((userEvent) => userEvent.id == eventId);
  const event = myEvent || baseEventWithStatus;

  // Split info_text into paragraphs based on double newlines
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
  const showDescriptionSection = hasInfoText || isFullScreen;

  const contactPerson = event?.contact;
  const orgMembership = userMemberships.find(
    (membership) => membership.organization.id == orgId
  );

  const isLoggedInAsContactPerson =
    contactPerson != undefined && contactPerson.id == orgMembership?.profile.id;

  const showContactDetails =
    !event?.cancelled && event?.status == 'booked' && !!contactPerson;

  const getFlexDirection = () => {
    if (isMobile) {
      return 'column-reverse';
    }

    if (!showDescriptionSection) {
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
            {/**TODO: figure out how to layout this properly for mobile and fullscreen without having this component appear twice */}
            {isMobile && showContactDetails && (
              <ContactPersonSection
                contactPerson={contactPerson}
                isLoggedInAsContactPerson={isLoggedInAsContactPerson}
              />
            )}
            <Box
              sx={{
                display: 'flex',
                flexDirection: getFlexDirection(),
                gap: showDescriptionSection ? 2 : 0,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: isFullScreen && showDescriptionSection ? 2 : 0,
                  width:
                    isFullScreen && showDescriptionSection ? '60%' : '100%',
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
                    <ContactPersonSection
                      contactPerson={contactPerson}
                      isLoggedInAsContactPerson={isLoggedInAsContactPerson}
                    />
                  </Box>
                )}

                {showDescriptionSection &&
                  (hasInfoText ? (
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
                  ) : (
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
                      <ZUIText color="secondary">
                        {messages.eventPage.noDescription()}
                      </ZUIText>
                    </Box>
                  ))}
              </Box>
              <Box
                bgcolor="white"
                borderRadius={2}
                display="flex"
                flexDirection="column"
                gap={2}
                minHeight={isFullScreen ? 400 : ''}
                padding={2}
                width={isFullScreen && showDescriptionSection ? '40%' : '100%'}
              >
                <SignUpSection event={event} />
                <DateAndLocation event={event} />
                {isLoggedInAsContactPerson && (
                  <ParticipatingInfo
                    participatingCount={event.num_participants_available}
                  />
                )}
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
  isLoggedInAsContactPerson: boolean;
}> = ({ contactPerson, isLoggedInAsContactPerson }) => {
  const [expandContactMethods, setExpandContactMethods] = useState(false);

  const hasContactMethods =
    ('email' in contactPerson || 'phone' in contactPerson) &&
    !isLoggedInAsContactPerson;

  return (
    <Box bgcolor="white" borderRadius={2} padding={2}>
      <Box alignItems="center" display="flex" gap={1}>
        <ZUIPersonAvatar
          firstName={contactPerson.name.split(' ')[0]}
          id={contactPerson.id}
          lastName={contactPerson.name.split(' ')[1]}
        />
        <ZUIText variant="bodyMdSemiBold">
          {isLoggedInAsContactPerson ? (
            <Msg id={messageIds.eventPage.contactPerson.you} />
          ) : (
            <Msg
              id={messageIds.eventPage.contactPerson.default}
              values={{ name: contactPerson.name }}
            />
          )}
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
  const user = useUser();
  const pathname = usePathname();
  const [signupSuccessful, setSignupSuccessful] = useState(false);
  const hasUnauthSignup = useFeatureWithOrg(
    UNAUTH_EVENT_SIGNUP,
    event.organization.id
  );

  if (event.cancelled) {
    return (
      <ZUIAlert
        description={messages.eventPage.cancelledParagraph()}
        severity="warning"
        title={messages.eventPage.cancelledHeader()}
      />
    );
  }

  const notAuthenticated = !user;
  const showUnauthSignup = notAuthenticated && hasUnauthSignup;

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

      <Box alignItems="center" display="flex" flexDirection="column" gap={1}>
        {showUnauthSignup ? (
          <>
            <Box width="100%">
              <PublicEventSignup
                event={event}
                onSignupSuccess={() => setSignupSuccessful(true)}
              />
            </Box>
            {!signupSuccessful && (
              <ZUIButton
                fullWidth
                href={`/login?redirect=${encodeURIComponent(
                  pathname || `/o/${event.organization.id}/events/${event.id}`
                )}`}
                label={messages.eventPage.haveAccount()}
                size="large"
                variant="secondary"
              />
            )}
          </>
        ) : (
          <EventSignupButton event={event} fullWidth />
        )}
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
          <Box sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
            <ZUILink href={event.url} openInNewTab text={event.url} />
          </Box>
        </Box>
      )}
      {event.location && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box alignItems="center" display="flex" gap={1}>
            <ZUIIcon icon={LocationPin} />
            <ZUIText variant="bodyMdSemiBold">{event.location.title}</ZUIText>
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
            RTLTextPlugin="/mapbox-gl-rtl-text-0.3.0.js"
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

const ParticipatingInfo: FC<{
  participatingCount: number;
}> = ({ participatingCount }) => {
  const isMobile = useIsMobile();

  return (
    <Box display="flex" flexDirection="column" gap={isMobile ? 1 : 2}>
      <Box alignItems="center" display="flex" gap={1}>
        <ZUIIcon icon={Person} />
        <ZUIText>
          <Msg
            id={messageIds.eventPage.participatingInfo}
            values={{
              participatingCount: participatingCount,
            }}
          />
        </ZUIText>
      </Box>
    </Box>
  );
};
