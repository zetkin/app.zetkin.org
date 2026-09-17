import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Box } from '@mui/system';
import { ScheduleOutlined } from '@mui/icons-material';
import Link from 'next/link';
import { Card, Divider, List, Typography } from '@mui/material';

import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SinglePersonLayout from 'features/profile/layout/SinglePersonLayout';
import usePerson from 'features/profile/hooks/usePerson';
import usePersonTimeline from 'features/profile/hooks/usePersonTimeline';
import ZUIFuture from 'zui/ZUIFuture';
import ZUITimeSpan from 'zui/ZUITimeSpan';
import { removeOffset } from 'utils/dateUtils';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';
import { ZetkinEvent } from 'utils/types/zetkin';
import { useMessages } from 'core/i18n';
import messageIds from 'features/events/l10n/messageIds';
import getEventUrl from 'features/events/utils/getEventUrl';
import { getPersonScaffoldProps, scaffoldOptions } from '../index';

const EventListItem = ({ event }: { event: ZetkinEvent }) => {
  const messages = useMessages(messageIds);
  return (
    <Link href={getEventUrl(event)} passHref style={{ textDecoration: 'none' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '1.0em',
        }}
      >
        <Typography>
          {event.title || event.activity?.title || messages.common.noTitle()}
        </Typography>
        <ZUIIconLabelRow
          color="secondary"
          iconLabels={[
            {
              icon: <ScheduleOutlined color="secondary" fontSize="inherit" />,
              label: (
                <ZUITimeSpan
                  end={new Date(removeOffset(event.start_time))}
                  start={new Date(removeOffset(event.end_time))}
                />
              ),
            },
          ]}
          size="sm"
        />
      </Box>
    </Link>
  );
};

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
  const timelineFuture = usePersonTimeline(orgId, personId);

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
      <ZUIFuture future={timelineFuture}>
        {(timeline) => {
          // Split in to "upcoming" and "past"
          const upcomingEvents = timeline.filter(
            (event) => new Date(event.data.action.start_time) > new Date()
          );
          const pastEvents = timeline.filter(
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
                  Upcoming Events
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
                          <EventListItem event={event.data.action} />
                        </>
                      );
                    })}
                  </List>
                </Card>
              ) : (
                <Typography>No upcoming events</Typography>
              )}
              <Box sx={{ display: 'flex', marginBottom: 1, marginTop: 2 }}>
                <Typography
                  sx={(theme) => ({
                    borderRight: `1px solid ${theme.palette.grey[300]}`,
                    paddingRight: 1,
                  })}
                  variant="h5"
                >
                  Past Events
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
                          <EventListItem event={event.data.action} />
                        </>
                      );
                    })}
                  </List>
                </Card>
              ) : (
                <Typography>No past events</Typography>
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
