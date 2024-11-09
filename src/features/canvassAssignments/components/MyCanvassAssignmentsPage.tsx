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

import useMyCanvassAssignments from '../hooks/useMyCanvassAssignments';
import useCanvassAssignment from '../hooks/useCanvassAssignment';
import useOrganization from 'features/organizations/hooks/useOrganization';
import ZUIFutures from 'zui/ZUIFutures';

const CanvassAssignmentCard: FC<{
  assignmentId: string;
  orgId: number;
}> = ({ orgId, assignmentId }) => {
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
                router.push(`/my/canvassassignments/${assignment.id}`)
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
  const myAssignments = useMyCanvassAssignments().data || [];

  return (
    <Box display="flex" flexDirection="column" gap={2} padding={1}>
      <Typography variant="h6">Canvassing</Typography>
      {myAssignments.map((assignment) => {
        return (
          <CanvassAssignmentCard
            key={assignment.id}
            assignmentId={assignment.id}
            orgId={assignment.organization.id}
          />
        );
      })}
    </Box>
  );
};

export default MyCanvassAssignmentsPage;
