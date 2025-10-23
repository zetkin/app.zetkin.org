import Head from 'next/head';
import { FC, Suspense } from 'react';
import {
  Avatar,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { GetServerSideProps } from 'next';
import {
  AssignmentOutlined,
  EmailOutlined,
  EventOutlined,
  PhoneOutlined,
} from '@mui/icons-material';

import useServerSide from 'core/useServerSide';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useSuborgsWithStats from 'features/organizations/hooks/useSuborgsWithStats';
import SuborgOverviewLayout from 'features/organizations/layouts/SuborgOverviewLayout';
import { Msg } from 'core/i18n';
import messageIds from 'features/organizations/l10n/messageIds';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import useOrganization from 'features/organizations/hooks/useOrganization';

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

const SuborgsList: FC<{ orgId: number }> = ({ orgId }) => {
  const organization = useOrganization(orgId).data;
  const suborgsWithStats = useSuborgsWithStats(orgId);

  if (suborgsWithStats.length == 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <ZUIEmptyState
          message={
            organization ? `${organization.title} has no suborganizations` : ''
          }
        />
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {suborgsWithStats.map((orgWithStats) => (
        <Paper key={orgWithStats.id}>
          <Box
            sx={{
              alignContent: 'center',
              gap: 1,
              padding: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                <Avatar alt="icon" src={`/api/orgs/${orgId}/avatar`} />
                <Typography variant="h5">{orgWithStats.title}</Typography>
              </Box>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                  <Typography>{orgWithStats.stats.numPeople}</Typography>
                  <Typography color="secondary">people</Typography>
                </Box>
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                  <Typography>{orgWithStats.stats.numLists}</Typography>
                  <Typography color="secondary">lists</Typography>
                </Box>
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                  <Typography>{orgWithStats.stats.numProjects}</Typography>
                  <Typography color="secondary">projects</Typography>
                </Box>
              </Box>
            </Box>
            <Typography color="secondary">
              Activity in the past 30 days:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                <PhoneOutlined color="secondary" />
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                  <Typography>{orgWithStats.stats.numCalls}</Typography>
                  <Typography color="secondary">calls</Typography>
                </Box>
              </Box>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                <AssignmentOutlined color="secondary" />
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                  <Typography>{orgWithStats.stats.numSubmissions}</Typography>
                  <Typography color="secondary">submissions</Typography>
                </Box>
              </Box>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                <EventOutlined color="secondary" />
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                  <Typography>
                    {orgWithStats.stats.numEventParticipants}
                  </Typography>
                  <Typography color="secondary">participants</Typography>
                </Box>
              </Box>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                <EmailOutlined color="secondary" />
                <Typography color="secondary">{`${orgWithStats.stats.numEmailsSent} sent`}</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      ))}
    </Stack>
  );
};

interface Props {
  orgId: string;
}

const SuborgsPage: PageWithLayout<Props> = ({ orgId }) => {
  const parsedOrgId = parseInt(orgId);
  const onServer = useServerSide();

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
        <SuborgsList orgId={parsedOrgId} />
      </Suspense>
    </>
  );
};

SuborgsPage.getLayout = function getLayout(page) {
  return <SuborgOverviewLayout>{page}</SuborgOverviewLayout>;
};

export default SuborgsPage;
