'use client';

import { FC } from 'react';
import { HomeWork } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';

import useMyCanvassAssignments from '../hooks/useMyAreaAssignments';
import { ZetkinAreaAssignment } from '../../areaAssignments/types';
import ZUIMarkdown from 'zui/ZUIMarkdown';
import useSidebarStats from '../hooks/useSidebarStats';
import useMembership from 'features/organizations/hooks/useMembership';
import useOrganization from 'features/organizations/hooks/useOrganization';
import ZUIFutures from 'zui/ZUIFutures';
import theme from 'theme';
import useAreaAssignmentSessions from 'features/areaAssignments/hooks/useAreaAssignmentSessions';
import useAreaAssignmentStats from 'features/areaAssignments/hooks/useAreaAssignmentStats';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';

const Page: FC<{
  assignment: ZetkinAreaAssignment;
}> = ({ assignment }) => {
  const orgFuture = useOrganization(assignment.organization.id);
  const router = useRouter();
  const { loading, stats } = useSidebarStats(
    assignment.organization.id,
    assignment.id
  );

  const { data } = useAreaAssignmentStats(
    assignment.organization.id,
    assignment.id
  );

  const allSessions =
    useAreaAssignmentSessions(assignment.organization.id, assignment.id).data ||
    [];

  const membershipFuture = useMembership(assignment.organization.id);
  const userPersonId = membershipFuture.data?.profile.id;
  const sessions = allSessions.filter(
    (session) =>
      session.assignment.id === assignment.id &&
      session.assignee.id === userPersonId
  );

  const areaIds = sessions.map((entry) => entry.area.id);
  const numberOfAreas = areaIds.length;

  return (
    <ZUIFutures futures={{ org: orgFuture }}>
      {({ data: { org } }) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100dvh',
            width: '100vw',
          }}
        >
          <Box
            alignItems="center"
            bgcolor={theme.palette.background.paper}
            display="flex"
            justifyContent="space-between"
            padding={2}
          >
            <Box>
              <Typography variant="body1">
                {assignment.title ?? <Msg id={messageIds.default.assignment} />}
              </Typography>
              <Box alignItems="center" display="flex" gap={1}>
                <Avatar
                  src={`/api/orgs/${org.id}/avatar`}
                  sx={{ height: 24, width: 24 }}
                />
                <Typography variant="body2">{org.title}</Typography>
              </Box>
            </Box>
          </Box>
          <Divider />
          <Box
            sx={{
              overflowY: 'auto',
              padding: 2,
              paddingBottom: 8,
            }}
          >
            {loading ? (
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Card
                sx={{
                  mx: 1,
                }}
              >
                <Box alignItems="center" display="flex">
                  <Typography m={1} p={1}>
                    <Msg id={messageIds.instructions.areas} />
                  </Typography>
                  <Divider orientation="vertical" sx={{ height: '20px' }} />
                  <Typography color="secondary" ml={2}>
                    {numberOfAreas}
                  </Typography>
                </Box>
                <Divider />
                <Box alignItems="center" display="flex" ml={2}>
                  <Box
                    alignItems="flex-start"
                    flexDirection="column"
                    mr={2}
                    pb={2}
                  >
                    <Box alignItems="center" display="flex" mt={2}>
                      <Typography color="primary" sx={{ mr: 0.5 }} variant="h5">
                        {stats.allTime.numHouseholds}
                      </Typography>
                      <Typography
                        color="textPrimary"
                        sx={{ mr: 0.5 }}
                        variant="h5"
                      >
                        {' / '}
                      </Typography>
                      <Typography color="secondary" sx={{ mr: 1 }} variant="h5">
                        {data?.num_households}
                      </Typography>
                    </Box>
                    <Typography color="secondary" pb={2} variant="caption">
                      <Msg id={messageIds.instructions.visitedHouseholds} />
                    </Typography>
                  </Box>
                  <Divider flexItem orientation="vertical" sx={{ mx: 2 }} />
                  <Box alignItems="flex-start" flexDirection="column" pb={2}>
                    <Box alignItems="center" display="flex" mt={2}>
                      <Typography color="primary" sx={{ mr: 0.5 }} variant="h5">
                        {stats.allTime.numLocations}
                      </Typography>
                      <Typography
                        color="textPrimary"
                        sx={{ mr: 0.5 }}
                        variant="h5"
                      >
                        {' / '}
                      </Typography>
                      <Typography
                        color="secondary"
                        sx={{ mr: 0.5 }}
                        variant="h5"
                      >
                        {data?.num_locations}
                      </Typography>
                    </Box>
                    <Typography color="textSecondary" mb={2} variant="caption">
                      <Msg id={messageIds.instructions.visitedLocations} />
                    </Typography>
                  </Box>
                </Box>
              </Card>
            )}
            {assignment.instructions ? (
              <Card sx={{ mt: 2, mx: 1 }}>
                <Typography m={2}>
                  <Msg id={messageIds.instructions.instructionsHeader} />
                </Typography>
                <Divider />
                <Box
                  sx={{
                    mx: 1,
                  }}
                >
                  <ZUIMarkdown markdown={assignment.instructions} />
                </Box>
              </Card>
            ) : (
              <Box
                sx={{
                  alignItems: 'center',
                  bottom: 80,
                  display: 'flex',
                  flexDirection: 'column',
                  left: 0,
                  position: 'absolute',
                  right: 0,
                }}
              >
                <HomeWork
                  sx={{ color: theme.palette.grey[400], fontSize: 100 }}
                />
                <Typography color="secondary" variant="body1">
                  <Msg id={messageIds.instructions.ready} />
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="center"
            sx={{
              bottom: 16,
              left: 0,
              position: 'absolute',
              right: 0,
            }}
          >
            <Button
              fullWidth
              onClick={() => router.push(`/canvass/${assignment.id}/map`)}
              sx={{
                width: '50%',
              }}
              variant="contained"
            >
              <Msg id={messageIds.instructions.start} />
            </Button>
          </Box>
        </Box>
      )}
    </ZUIFutures>
  );
};

type CanvassInstructionsPageProps = {
  canvassAssId: string;
};

const CanvassInstructionsPage: FC<CanvassInstructionsPageProps> = ({
  canvassAssId,
}) => {
  const myAssignments = useMyCanvassAssignments() || [];
  const assignment = myAssignments.find(
    (assignment) => assignment.id == canvassAssId
  );

  if (!assignment) {
    return null;
  }

  return <Page assignment={assignment} />;
};

export default CanvassInstructionsPage;
