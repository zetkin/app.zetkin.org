import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import NextLink from 'next/link';
import { Avatar, Box, Button, Link, Typography } from '@mui/material';

import { scaffold } from 'utils/next';
import useEvent from 'features/events/hooks/useEvent';
import useEventSignup from 'features/events/hooks/useEventSignup';
import useServerSide from 'core/useServerSide';
import ZUIDateTime from 'zui/ZUIDateTime';
import ZUIFuture from 'zui/ZUIFuture';

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
          <Box display="flex" flexDirection="column">
            <Avatar alt="icon" src={`/api/orgs/${orgId}/avatar`} />
            <Typography>{event.organization.title}</Typography>
            <Typography>{event.title}</Typography>
            <Typography>{event.info_text}</Typography>
            <ZUIDateTime datetime={event.start_time} />
            {location && <Typography>{location.title}</Typography>}
            {event.campaign && (
              <NextLink
                href={`/o/${orgId}/projects/${event.campaign.id}`}
                passHref
              >
                <Link color="inherit" underline="hover">
                  {event.campaign.title}
                </Link>
              </NextLink>
            )}
            <ZUIFuture future={eventSignupFuture}>
              {({ myResponseState, signup, undoSignup }) =>
                myResponseState == 'notSignedUp' ? (
                  <Button onClick={signup}>Sign up</Button>
                ) : myResponseState == 'responded' ? (
                  <Button onClick={undoSignup}>Undo</Button>
                ) : (
                  <Typography>{"You're signed up!"}</Typography>
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
