import Head from 'next/head';
import { FC, Suspense, useState } from 'react';
import {
  Avatar,
  Box,
  CircularProgress,
  Paper,
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
import SuborgOverviewLayout from 'features/organizations/layouts/SuborgOverviewLayout';
import { Msg } from 'core/i18n';
import messageIds from 'features/organizations/l10n/messageIds';
import SuborgsList, {
  isError,
} from 'features/organizations/components/SuborgsList';
import useSuborgWithStats from 'features/organizations/hooks/useSuborgWithStatus';
import useEmailThemes from 'features/emails/hooks/useEmailThemes';
import useEmailConfigs from 'features/emails/hooks/useEmailConfigs';

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

const SuborgCard: FC<{ orgId: number }> = ({ orgId }) => {
  const suborgWithStats = useSuborgWithStats(orgId);
  const themes = useEmailThemes(orgId).data || [];
  const configs = useEmailConfigs(orgId).data || [];
  const usesEmailFeature = configs.length > 0 && themes.length > 0;

  if (isError(suborgWithStats)) {
    return <>hej</>;
  }

  return (
    <Paper>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 1, padding: 2 }}
      >
        <Box>
          <Avatar alt="icon" src={`/api/orgs/${orgId}/avatar`} />
          <Typography variant="h5">{suborgWithStats.title}</Typography>
        </Box>
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
              <Typography>{suborgWithStats.stats.numPeople}</Typography>
              <Typography color="secondary">people</Typography>
            </Box>
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
              <Typography>{suborgWithStats.stats.numLists}</Typography>
              <Typography color="secondary">lists</Typography>
            </Box>
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
              <Typography>{suborgWithStats.stats.numProjects}</Typography>
              <Typography color="secondary">projects</Typography>
            </Box>
          </Box>
          <Typography color="secondary">
            Activity in the past 30 days:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
              <PhoneOutlined color="secondary" />
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                <Typography>{suborgWithStats.stats.numCalls}</Typography>
                <Typography color="secondary">calls</Typography>
              </Box>
            </Box>
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
              <AssignmentOutlined color="secondary" />
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                <Typography>{suborgWithStats.stats.numSubmissions}</Typography>
                <Typography color="secondary">submissions</Typography>
              </Box>
            </Box>
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
              <EventOutlined color="secondary" />
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                <Typography>
                  {suborgWithStats.stats.numEventParticipants}
                </Typography>
                <Typography color="secondary">participants in </Typography>
                <Typography>
                  {suborgWithStats.stats.numEventsWithParticipants}
                </Typography>
                <Typography color="secondary">events</Typography>
              </Box>
            </Box>
            {usesEmailFeature && (
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                <EmailOutlined color="secondary" />
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                  <Typography>{suborgWithStats.stats.numEmailsSent}</Typography>
                  <Typography color="secondary">sent</Typography>
                </Box>
              </Box>
            )}
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
        <Box sx={{ flex: 1 }}>
          {!selectedSuborgId && <>No selected suborg to inspect</>}
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
    </>
  );
};

SuborgsPage.getLayout = function getLayout(page) {
  return <SuborgOverviewLayout>{page}</SuborgOverviewLayout>;
};

export default SuborgsPage;
