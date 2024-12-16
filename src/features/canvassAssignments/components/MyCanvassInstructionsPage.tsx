'use client';

import { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import useMyCanvassAssignments from '../hooks/useMyCanvassAssignments';
import { ZetkinCanvassAssignment } from '../types';
import ZUIMarkdown from 'zui/ZUIMarkdown';

const InstructionsPage: FC<{
  assignment: ZetkinCanvassAssignment;
}> = ({ assignment }) => {
  const router = useRouter();

  return (
    <Box display="flex" flexDirection="column" gap={2} padding={1}>
      {!assignment.instructions && (
        <Typography p={1} variant="h6">
          This canvass assignment does not have instructions so you can go ahead
          and start with the assignment, good luck!
        </Typography>
      )}
      {assignment.instructions && (
        <>
          <Typography p={1} variant="h6">
            Before you begin the canvass assignment, take a moment to review the
            instructions to ensure your success. Good luck!
          </Typography>

          <Box mx={1}>
            <ZUIMarkdown markdown={assignment.instructions} />
          </Box>
        </>
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
