'use client';

import { FC, Suspense } from 'react';
import { Box, Typography } from '@mui/material';

import AssignmentStats from '../components/AssignmentStats';
import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import ZUIMarkdown from 'zui/ZUIMarkdown';

type Props = {
  assignment: ZetkinCallAssignment;
};

const AssignmentDetailsPage: FC<Props> = ({ assignment }) => {
  return (
    <Box display="flex">
      <Box>
        <Typography variant="h4">{assignment.title}</Typography>
        {!!assignment.description.length && (
          <Typography variant="body1">{assignment.description}</Typography>
        )}
        <Suspense fallback={<ZUILogoLoadingIndicator />}>
          <AssignmentStats assignment={assignment} />
        </Suspense>
      </Box>
      <Box>
        <Typography variant="h5">
          <Msg id={messageIds.instructions.title} />
        </Typography>
        <Typography>
          <ZUIMarkdown markdown={assignment.instructions} />
        </Typography>
      </Box>
    </Box>
  );
};

export default AssignmentDetailsPage;
