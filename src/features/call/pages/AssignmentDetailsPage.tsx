'use client';

import { FC, Suspense } from 'react';
import { Box, Typography } from '@mui/material';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import AssignmentStats from '../components/AssignmentStats';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';

type Props = {
  assignment: ZetkinCallAssignment;
};

const AssignmentDetailsPage: FC<Props> = ({ assignment }) => {
  return (
    <Box>
      <Typography variant="h4">{assignment.title}</Typography>
      {!!assignment.description.length && (
        <Typography variant="body1">{assignment.description}</Typography>
      )}
      <Suspense fallback={<ZUILogoLoadingIndicator />}>
        <AssignmentStats assignment={assignment} />
      </Suspense>
    </Box>
  );
};

export default AssignmentDetailsPage;
