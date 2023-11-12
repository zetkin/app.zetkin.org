import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { Avatar, Box, Button, Typography } from '@mui/material';

import messageIds from 'features/events/l10n/messageIds';
import { Msg } from 'core/i18n';
import { scaffold } from 'utils/next';
import useEvent from 'features/events/hooks/useEvent';
import useEventSignup from 'features/events/hooks/useEventSignup';
import useServerSide from 'core/useServerSide';
import ZUIDateTime from 'zui/ZUIDateTime';
import ZUIFuture from 'zui/ZUIFuture';
import { BeachAccess, CalendarToday, Place } from '@mui/icons-material';

const scaffoldOptions = {
  allowNonMembers: true,
  allowNonOfficials: true,
  authLevelRequired: 1,
};

export const getServerSideProps = scaffold(async (ctx) => {
  const { eventId, orgId } = ctx.params!;

  return {
    props: {
      eventId,
      orgId,
    },
  };
}, scaffoldOptions);

type PageProps = {
  eventId: string;
  orgId: string;
};

const Map = dynamic(
  () => import('features/events/components/ActivistEventPage/Map'),
  { ssr: false }
);

const Page: FC<PageProps> = ({ orgId, eventId }) => {
  const eventFuture = useEvent(parseInt(orgId, 10), parseInt(eventId, 10));
  const onServer = useServerSide();
  const eventSignupFuture = useEventSignup(
    parseInt(orgId, 10),
    parseInt(eventId, 10)
  );

  if (onServer) {
    return null;
  }

  return (
    <ZUIFuture future={eventFuture}>
      {(event) => {
        const location = event.location;
        return (
          <Box display="flex" flexDirection="column" padding={2}>
            <Typography variant="h4">{event.title}</Typography>
            <Box alignItems="center" display="flex">
              <Avatar alt="icon" src={`/api/orgs/${orgId}/avatar`} />
              <Typography color="secondary">
                {event.organization.title}
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column" gap={1} paddingY={1}>
              {event.activity && (
                <Box alignItems="center" display="flex">
                  <BeachAccess color="secondary" sx={{ marginRight: 1 }} />
                  <Typography>{event.activity.title}</Typography>
                </Box>
              )}
              <Box alignItems="center" display="flex">
                <CalendarToday color="secondary" sx={{ marginRight: 1 }} />
                <ZUIDateTime datetime={event.start_time} />
              </Box>
              {location && (
                <Box alignItems="center" display="flex">
                  <Place color="secondary" sx={{ marginRight: 1 }} />
                  <Typography>{location.title}</Typography>
                </Box>
              )}
            </Box>
            <Typography>{event.info_text}</Typography>
            <ZUIFuture
              future={eventSignupFuture}
              skeleton={
                <Button variant="contained">
                  <Msg id={messageIds.activistPortal.loadingButton} />
                </Button>
              }
            >
              {({ myResponseState, signup, undoSignup }) =>
                myResponseState == 'notSignedUp' ? (
                  <Button onClick={signup} variant="contained">
                    <Msg id={messageIds.activistPortal.signupButton} />
                  </Button>
                ) : myResponseState == 'signedUp' ? (
                  <Button onClick={undoSignup} variant="contained">
                    <Msg id={messageIds.activistPortal.undoSignupButton} />
                  </Button>
                ) : myResponseState == 'booked' ? (
                  <Typography>
                    <Msg id={messageIds.activistPortal.bookedMessage} />
                  </Typography>
                ) : (
                  <Typography>
                    <Msg id={messageIds.activistPortal.notInOrgMessage} />
                  </Typography>
                )
              }
            </ZUIFuture>
            {location && (
              <Box>
                <Map location={location} />
              </Box>
            )}
          </Box>
        );
      }}
    </ZUIFuture>
  );
};

export default Page;
