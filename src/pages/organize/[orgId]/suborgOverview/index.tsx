import Head from 'next/head';
import { FC, Suspense, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  lighten,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import { GetServerSideProps } from 'next';
import { Assignment, Event, Phone } from '@mui/icons-material';

import useServerSide from 'core/useServerSide';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SuborgOverviewLayout from 'features/organizations/layouts/SuborgOverviewLayout';
import { Msg } from 'core/i18n';
import messageIds from 'features/organizations/l10n/messageIds';
import SuborgsList, {
  isError,
} from 'features/organizations/components/SuborgsList';
import useSuborgWithFullStats from 'features/organizations/hooks/useSuborgWithFullStats';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId } = ctx.params!;
    return {
      props: {
        orgId,
      },
    };
  },
  {
    authLevelRequired: 2,
  }
);

export const SuborgCard: FC<{ orgId: number }> = ({ orgId }) => {
  const suborgWithFullStats = useSuborgWithFullStats(orgId);

  if (isError(suborgWithFullStats)) {
    return (
      <Alert severity="error">{`Error fetching data for org ${orgId}`}</Alert>
    );
  }

  let mostParticipants = 0;
  Object.values(suborgWithFullStats.stats.numBookedByEventsByStartDate).forEach(
    (numBooked) => {
      if (numBooked > mostParticipants) {
        mostParticipants = numBooked;
      }
    }
  );

  let mostCalls = 0;
  Object.values(suborgWithFullStats.stats.numCallsByCallDate).forEach(
    (numCalls) => {
      if (numCalls > mostCalls) {
        mostCalls = numCalls;
      }
    }
  );

  let mostSubmissions = 0;
  Object.values(suborgWithFullStats.stats.numSubmissionsBySubmitDate).forEach(
    (numSubmissions) => {
      if (numSubmissions > mostSubmissions) {
        mostSubmissions = numSubmissions;
      }
    }
  );

  return (
    <Paper>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 1, padding: 2 }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
          <Avatar alt="icon" src={`/api/orgs/${orgId}/avatar`} />
          <Typography variant="h5">{suborgWithFullStats.title}</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
            <Typography variant="h5">
              {suborgWithFullStats.stats.numPeople}
            </Typography>
            <Typography color="secondary">people</Typography>
          </Box>
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
            <Typography variant="h5">
              {suborgWithFullStats.stats.numLists}
            </Typography>
            <Typography color="secondary">lists</Typography>
          </Box>
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
            <Typography variant="h5">
              {suborgWithFullStats.stats.numProjects}
            </Typography>
            <Typography color="secondary">projects</Typography>
          </Box>
        </Box>
        <Typography color="secondary">In the past 30 days:</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Box>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                <Phone color="secondary" />
                <Typography variant="h6">Calling</Typography>
              </Box>
              <Typography color="secondary">{`${suborgWithFullStats.stats.numCalls} calls made`}</Typography>
            </Box>
            <Box
              sx={(theme) => ({
                alignItems: 'flex-end',
                backgroundColor: lighten(theme.palette.primary.main, 0.95),
                display: 'flex',
                height: '48px',
              })}
            >
              {Object.entries(suborgWithFullStats.stats.numCallsByCallDate).map(
                ([callDate, numCalls]) => {
                  const noDateHasCalls = mostCalls == 0;
                  const thisDateHadNoCalls = numCalls == 0;
                  return (
                    <Tooltip
                      key={`${callDate}-calls`}
                      arrow
                      title={`${numCalls} calls made on ${callDate}`}
                    >
                      <Box
                        sx={(theme) => ({
                          '&:hover': {
                            backgroundColor: theme.palette.grey[300],
                          },
                          alignContent: 'end',
                          height: '100%',
                          marginRight: 0.5,
                          width: 1 / 30,
                        })}
                      >
                        <Box
                          sx={(theme) => ({
                            backgroundColor:
                              noDateHasCalls || thisDateHadNoCalls
                                ? theme.palette.grey[400]
                                : theme.palette.primary.main,
                            borderRadius: '4px',
                            height:
                              noDateHasCalls || thisDateHadNoCalls
                                ? '2px'
                                : `${Math.round(
                                    (numCalls / mostCalls) * 100
                                  )}%`,
                          })}
                        />
                      </Box>
                    </Tooltip>
                  );
                }
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5 }}>
                <Event color="secondary" />
                <Typography variant="h6">Event participation</Typography>
              </Box>
              <Typography color="secondary">{`${suborgWithFullStats.stats.numBookedForEvents} people booked for ${suborgWithFullStats.stats.numEventsWithBookedPeople} events`}</Typography>
            </Box>
            <Box
              sx={(theme) => ({
                alignItems: 'flex-end',
                backgroundColor: lighten(theme.palette.primary.main, 0.95),
                display: 'flex',
                height: '48px',
              })}
            >
              {Object.entries(
                suborgWithFullStats.stats.numBookedByEventsByStartDate
              ).map(([startDate, numBooked]) => {
                const noEventsHadParticipants = mostParticipants == 0;
                const thisDateHadNoParticipants = numBooked == 0;

                return (
                  <Tooltip
                    key={startDate}
                    arrow
                    title={`${numBooked} booked on events on ${startDate}`}
                  >
                    <Box
                      sx={(theme) => ({
                        '&:hover': {
                          backgroundColor: theme.palette.grey[300],
                        },
                        alignContent: 'end',
                        height: '100%',
                        marginRight: 0.5,
                        width: 1 / 30,
                      })}
                    >
                      <Box
                        sx={(theme) => ({
                          backgroundColor:
                            noEventsHadParticipants || thisDateHadNoParticipants
                              ? theme.palette.grey[400]
                              : theme.palette.primary.main,
                          borderRadius: '4px',
                          height:
                            noEventsHadParticipants || thisDateHadNoParticipants
                              ? '2px'
                              : `${Math.round(
                                  (numBooked / mostParticipants) * 100
                                )}%`,
                        })}
                      />
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5 }}>
                <Assignment color="secondary" />
                <Typography variant="h6">Survey submissions</Typography>
              </Box>
              <Typography color="secondary">{`${suborgWithFullStats.stats.numSubmissions} survey submissions made`}</Typography>
            </Box>
            <Box
              sx={(theme) => ({
                alignItems: 'flex-end',
                backgroundColor: lighten(theme.palette.primary.main, 0.95),
                display: 'flex',
                height: '48px',
              })}
            >
              {Object.entries(
                suborgWithFullStats.stats.numSubmissionsBySubmitDate
              ).map(([submitDate, numSubmissions]) => {
                const noDateHadSubmissions = mostSubmissions == 0;
                const thisDateHadNoSubmissions = numSubmissions == 0;

                return (
                  <Tooltip
                    key={submitDate}
                    arrow
                    title={`${numSubmissions} submissions made on ${submitDate}`}
                  >
                    <Box
                      sx={(theme) => ({
                        '&:hover': {
                          backgroundColor: theme.palette.grey[300],
                        },
                        alignContent: 'end',
                        height: '100%',
                        marginRight: 0.5,
                        width: 1 / 30,
                      })}
                    >
                      <Box
                        sx={(theme) => ({
                          backgroundColor:
                            noDateHadSubmissions || thisDateHadNoSubmissions
                              ? theme.palette.grey[400]
                              : theme.palette.primary.main,
                          borderRadius: '4px',
                          height:
                            noDateHadSubmissions || thisDateHadNoSubmissions
                              ? '2px'
                              : `${Math.round(
                                  (numSubmissions / mostSubmissions) * 100
                                )}%`,
                        })}
                      />
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

interface Props {
  orgId: string;
}

const SuborgsPage: PageWithLayout<Props> = ({ orgId }) => {
  const parsedOrgId = parseInt(orgId);
  const onServer = useServerSide();
  const [selectedSuborgId, setSelectedSuborgId] = useState<number | null>(null);

  if (onServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          <Msg id={messageIds.overview.suborgs.title} />
        </title>
      </Head>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Suspense
              fallback={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <CircularProgress />
                </Box>
              }
            >
              <SuborgsList
                onSelectSuborg={(suborgId: number) =>
                  setSelectedSuborgId(suborgId)
                }
                orgId={parsedOrgId}
              />
            </Suspense>
          </Box>
          <Box sx={{ flex: 1.2 }}>
            {!selectedSuborgId && <>No suborganization selected</>}
            {selectedSuborgId && (
              <Suspense
                fallback={
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <CircularProgress />
                  </Box>
                }
              >
                <SuborgCard orgId={selectedSuborgId} />
              </Suspense>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

SuborgsPage.getLayout = function getLayout(page) {
  return <SuborgOverviewLayout>{page}</SuborgOverviewLayout>;
};

export default SuborgsPage;
