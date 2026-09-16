import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Box } from '@mui/system';
import Link from 'next/link';
import { Card, Divider, List, Typography } from '@mui/material';

import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SinglePersonLayout from 'features/profile/layout/SinglePersonLayout';
import usePerson from 'features/profile/hooks/usePerson';
import usePersonTimeline from 'features/profile/hooks/usePersonTimeline';
import ZUIFuture from 'zui/ZUIFuture';
import { getPersonScaffoldProps, scaffoldOptions } from '../index';

export const getServerSideProps: GetServerSideProps = scaffold(
  getPersonScaffoldProps,
  scaffoldOptions
);

interface PersonTimelinePageProps {
  orgId: number;
  personId: number;
}

const PersonTimelinePage: PageWithLayout<PersonTimelinePageProps> = ({
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
          return (
            <Card>
              <List>
                {timeline.map((event, index) => {
                  if (event.event === 'action') {
                    return (
                      <>
                        {index > 0 && <Divider variant="fullWidth" />}
                        <Link
                          href={'/'}
                          passHref
                          style={{ textDecoration: 'none' }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              padding: '1.0em',
                            }}
                          >
                            <Typography>{event.data.action.title}</Typography>
                            {event.data.action.info_text && (
                              <Box>
                                <Typography variant="body2">
                                  {event.data.action.info_text}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Link>
                      </>
                    );
                  }
                })}
              </List>
            </Card>
          );
        }}
      </ZUIFuture>
    </>
  );
};

PersonTimelinePage.getLayout = function getLayout(page) {
  return <SinglePersonLayout>{page}</SinglePersonLayout>;
};

export default PersonTimelinePage;
