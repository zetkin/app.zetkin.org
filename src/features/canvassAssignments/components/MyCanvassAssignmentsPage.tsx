'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';

import useMyCanvassSessions from '../hooks/useMyCanvassSessions';
import useCanvassAssignment from '../hooks/useCanvassAssignment';
import useOrganization from 'features/organizations/hooks/useOrganization';
import ZUIFutures from 'zui/ZUIFutures';
import { ZetkinCanvassSession } from '../types';

const CanvassAssignmentCard: FC<{
  areaId: string;
  assignmentId: string;
  orgId: number;
}> = ({ areaId, orgId, assignmentId }) => {
  const router = useRouter();
  const assignmentFuture = useCanvassAssignment(orgId, assignmentId);
  const organizationFuture = useOrganization(orgId);

  return (
    <ZUIFutures
      futures={{
        assignment: assignmentFuture,
        organization: organizationFuture,
      }}
    >
      {({ data: { assignment, organization } }) => (
        <Card>
          <CardContent>
            <Typography variant="h6">
              {assignment.title || 'Untitled assignment'}
            </Typography>
            <Typography>{organization.title}</Typography>
          </CardContent>
          <CardActions>
            <Button
              onClick={() =>
                router.push(
                  `/o/${orgId}/areas/${areaId}?canvassAssId=${assignment.id}`
                )
              }
              variant="outlined"
            >
              Go to map
            </Button>
          </CardActions>
        </Card>
      )}
    </ZUIFutures>
  );
};

const MyCanvassAssignmentsPage: FC = () => {
  const mySessions = useMyCanvassSessions().data || [];

  const sessionsByAssignmentId: Record<string, ZetkinCanvassSession[]> = {};
  mySessions.forEach((session) => {
    if (!sessionsByAssignmentId[session.assignment.id]) {
      sessionsByAssignmentId[session.assignment.id] = [session];
    } else {
      sessionsByAssignmentId[session.assignment.id].push(session);
    }
  });

  return (
    <Box display="flex" flexDirection="column" gap={2} padding={1}>
      <Typography variant="h6">Canvassing</Typography>
      {Object.values(sessionsByAssignmentId).map((sessions) => {
        return (
          <CanvassAssignmentCard
            key={sessions[0].assignment.id}
            areaId={sessions[0].area.id}
            assignmentId={sessions[0].assignment.id}
            orgId={sessions[0].area.organization.id}
          />
        );
      })}
    </Box>
  );
};

export default MyCanvassAssignmentsPage;
