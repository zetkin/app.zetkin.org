import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Box } from '@mui/system';
import { Card, Divider, List, Skeleton, Typography } from '@mui/material';

import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SinglePersonLayout from 'features/profile/layout/SinglePersonLayout';
import usePerson from 'features/profile/hooks/usePerson';
import usePersonEvents from 'features/profile/hooks/usePersonEvents';
import ZUIFuture from 'zui/ZUIFuture';
import { Msg } from 'core/i18n';
import profileMessageIds from 'features/profile/l10n/messageIds';
import PersonEventListItem from 'features/profile/components/PersonEventListItem';
import { getPersonScaffoldProps, scaffoldOptions } from '../index';

export const getServerSideProps: GetServerSideProps = scaffold(
  getPersonScaffoldProps,
  scaffoldOptions
);

interface PersonEventsPageProps {
  orgId: number;
  personId: number;
}

const PersonEventsPage: PageWithLayout<PersonEventsPageProps> = ({
  orgId,
  personId,
}) => {
  const { data: person } = usePerson(orgId, personId);
  const personEventsFuture = usePersonEvents(orgId, personId);

  if (!person) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {person?.first_name} {person?.last_name}
        </title>
      </Head>
      <ZUIFuture
        future={personEventsFuture}
        skeleton={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
            <Skeleton variant="rounded" width={190} />
            <Skeleton height={100} variant="rounded" />
            <Skeleton variant="rounded" width={210} />
            <Skeleton height={200} variant="rounded" />
          </Box>
        }
      >
        {(eventsTimeline) => {
          // Split in to "upcoming" and "past"
          const upcomingEvents = eventsTimeline.filter(
            (event) => new Date(event.data.action.start_time) > new Date()
          );
          const pastEvents = eventsTimeline.filter(
            (event) => new Date(event.data.action.end_time) < new Date()
          );
          return (
            <>
              <Box sx={{ display: 'flex', marginBottom: 1 }}>
                <Typography
                  sx={(theme) => ({
                    borderRight: `1px solid ${theme.palette.grey[300]}`,
                    paddingRight: 1,
                  })}
                  variant="h5"
                >
                  <Msg id={profileMessageIds.events.upcoming} />
                </Typography>
                <Typography
                  sx={(theme) => ({
                    color: theme.palette.primary.main,
                    paddingLeft: 1,
                  })}
                  variant="h5"
                >
                  {upcomingEvents.length}
                </Typography>
              </Box>
              {upcomingEvents.length > 0 ? (
                <Card>
                  <List>
                    {upcomingEvents.map((event, index) => {
                      return (
                        <>
                          {index > 0 && <Divider variant="fullWidth" />}
                          <PersonEventListItem event={event.data.action} />
                        </>
                      );
                    })}
                  </List>
                </Card>
              ) : (
                <Typography>
                  <Msg id={profileMessageIds.events.noUpcoming} />
                </Typography>
              )}
              <Box sx={{ display: 'flex', marginBottom: 1, marginTop: 2 }}>
                <Typography
                  sx={(theme) => ({
                    borderRight: `1px solid ${theme.palette.grey[300]}`,
                    paddingRight: 1,
                  })}
                  variant="h5"
                >
                  <Msg id={profileMessageIds.events.past} />
                </Typography>
                <Typography
                  sx={(theme) => ({
                    color: theme.palette.primary.main,
                    paddingLeft: 1,
                  })}
                  variant="h5"
                >
                  {pastEvents.length}
                </Typography>
              </Box>
              {pastEvents.length > 0 ? (
                <Card>
                  <List>
                    {pastEvents.map((event, index) => {
                      return (
                        <>
                          {index > 0 && <Divider variant="fullWidth" />}
                          <PersonEventListItem event={event.data.action} />
                        </>
                      );
                    })}
                  </List>
                </Card>
              ) : (
                <Typography>
                  <Msg id={profileMessageIds.events.noPast} />
                </Typography>
              )}
            </>
          );
        }}
      </ZUIFuture>
    </>
  );
};

PersonEventsPage.getLayout = function getLayout(page) {
  return <SinglePersonLayout>{page}</SinglePersonLayout>;
};

export default PersonEventsPage;
