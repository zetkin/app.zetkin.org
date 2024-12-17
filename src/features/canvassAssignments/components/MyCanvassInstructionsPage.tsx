'use client';

import { FC } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';

import useMyCanvassAssignments from '../hooks/useMyCanvassAssignments';
import { ZetkinCanvassAssignment } from '../types';
import ZUIMarkdown from 'zui/ZUIMarkdown';
import useSidebarStats from '../hooks/useSidebarStats';
import useCanvassSessions from '../hooks/useCanvassSessions';
import useMembership from 'features/organizations/hooks/useMembership';
import useCanvassAssignmentStats from '../hooks/useCanvassAssignmentStats';

const InstructionsPage: FC<{
  assignment: ZetkinCanvassAssignment;
}> = ({ assignment }) => {
  const router = useRouter();
  const { stats } = useSidebarStats(assignment.organization.id, assignment.id);

  const { data } = useCanvassAssignmentStats(
    assignment.organization.id,
    assignment.id
  );

  const allSessions =
    useCanvassSessions(assignment.organization.id, assignment.id).data || [];

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
    <Box display="flex" flexDirection="column" gap={2} padding={1}>
      <Typography>{assignment.title}</Typography>
      <Box display="flex" justifyContent="space-evenly">
        <Card
          sx={{ borderRadius: 2, maxWidth: 300, pr: 1, textAlign: 'center' }}
        >
          <CardContent>
            <Typography gutterBottom variant="subtitle2">
              Saved Locations
            </Typography>
            <Grid alignItems="center" container spacing={1}>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography color="secondary" variant="subtitle1">
                    {data?.num_places}
                  </Typography>
                  <Typography color="text.secondary" variant="subtitle2">
                    Places
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography
                    color="secondary"
                    component="div"
                    variant="subtitle1"
                  >
                    {data?.num_households}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ textAlign: 'center' }}
                    variant="subtitle2"
                  >
                    Households
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card
          sx={{ borderRadius: 2, maxWidth: 300, pr: 1, textAlign: 'center' }}
        >
          <CardContent>
            <Typography component="div" gutterBottom variant="subtitle2">
              Locations visited
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography
                    color="secondary"
                    component="div"
                    variant="subtitle1"
                  >
                    {stats.allTime.numPlaces}
                  </Typography>
                  <Typography color="text.secondary" variant="subtitle2">
                    Places
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography
                    color="secondary"
                    component="div"
                    variant="subtitle1"
                  >
                    {stats.allTime.numHouseholds}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ textAlign: 'center' }}
                    variant="subtitle2"
                  >
                    Households
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
      <Box display="flex" justifyContent="center" textAlign="center">
        <Card
          sx={{
            borderRadius: 2,
            justifyContent: 'center',
            maxWidth: 200,
            textAlign: 'center',
          }}
        >
          <CardContent>
            <Typography gutterBottom variant="subtitle2">
              Areas assigned
            </Typography>
            <Grid container justifyContent="center" spacing={1}>
              <Grid item xs={6}>
                <Box justifyContent="center" textAlign="center">
                  <Typography color="secondary" variant="subtitle1">
                    {numberOfAreas}
                  </Typography>
                  <Typography color="text.secondary" variant="subtitle2">
                    Areas
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {assignment.instructions && (
        <Box mx={1}>
          <ZUIMarkdown markdown={assignment.instructions} />
        </Box>
      )}
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
          onClick={() =>
            router.push(`/my/canvassassignments/${assignment.id}/map`)
          }
          sx={{
            width: '90%',
          }}
          variant="contained"
        >
          Start Canvassing
        </Button>
      </Box>
    </Box>
  );
};

type MyCanvassInstructionsPageProps = {
  canvassAssId: string;
};

const MyCanvassInstructionsPage: FC<MyCanvassInstructionsPageProps> = ({
  canvassAssId,
}) => {
  const myAssignments = useMyCanvassAssignments().data || [];
  const assignment = myAssignments.find(
    (assignment) => assignment.id == canvassAssId
  );

  if (!assignment) {
    return null;
  }

  return <InstructionsPage assignment={assignment} />;
};

export default MyCanvassInstructionsPage;
