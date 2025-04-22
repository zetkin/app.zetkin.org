'use client';

import { Box, Typography } from '@mui/material';
import { FC } from 'react';

import newTheme from 'zui/theme';
import { ZetkinCallAssignment, ZetkinEvent } from 'utils/types/zetkin';
import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import ZUIMarkdown from 'zui/ZUIMarkdown';

export type EventsByProject = {
  campaign: { id: number; title: string };
  events: ZetkinEvent[];
};

type Props = {
  assignment: ZetkinCallAssignment;
};

const AssignmentStatsPage: FC<Props> = ({ assignment }) => {
  assignment;

  return (
    <Box m={2}>
      <ZUISection
        renderContent={() => (
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Box>
              <Typography sx={{ color: newTheme.palette.data.main }}>
                {1}
              </Typography>
              <ZUIText variant="headingSm">successful calls </ZUIText>
            </Box>
            <Box>
              <Typography sx={{ color: newTheme.palette.data.main }}>
                {2}
              </Typography>
              <ZUIText variant="headingSm"> calls made</ZUIText>
            </Box>
            <Box>
              <Typography sx={{ color: newTheme.palette.data.main }}>
                {3}
              </Typography>
              <ZUIText variant="headingSm">people in target group</ZUIText>
            </Box>
          </Box>
        )}
        title={'Assignment'}
      />
      {assignment.instructions && (
        <Box mt={2}>
          <ZUISection
            renderContent={() => (
              <ZUIMarkdown markdown={assignment.instructions} />
            )}
            title={'Instructions'}
          />
        </Box>
      )}
    </Box>
  );
};

export default AssignmentStatsPage;
