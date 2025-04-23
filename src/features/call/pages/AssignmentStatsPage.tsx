'use client';

import { Box, useMediaQuery, useTheme } from '@mui/material';
import { FC } from 'react';

import { ZetkinCallAssignment, ZetkinEvent } from 'utils/types/zetkin';
import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import ZUIMarkdown from 'zui/ZUIMarkdown';
import useSimpleCallAssignmentStats from '../hooks/useSimpleCallAssignmentStats';

export type EventsByProject = {
  campaign: { id: number; title: string };
  events: ZetkinEvent[];
};

type Props = {
  assignment: ZetkinCallAssignment;
};

const AssignmentStatsPage: FC<Props> = ({ assignment }) => {
  const stats = useSimpleCallAssignmentStats(
    assignment.organization.id,
    assignment.id
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box m={2}>
      <ZUISection
        renderContent={() => (
          <>
            {isMobile && (
              <Box display="flex" gap={10} justifyContent="flex-start" mt={2}>
                <Box>
                  <Box display="flex">
                    <Box
                      mr={1}
                      sx={(theme) => ({ color: theme.palette.data.main })}
                    >
                      <ZUIText color="inherit">
                        {stats.num_calls_reached}
                      </ZUIText>
                    </Box>
                    <ZUIText color="secondary">
                      / {stats.num_calls_made}
                    </ZUIText>
                  </Box>
                  <ZUIText variant="headingSm">successful</ZUIText>
                </Box>
                <Box>
                  <Box
                    mr={1}
                    sx={(theme) => ({ color: theme.palette.data.main })}
                  >
                    <ZUIText color="inherit">
                      {stats.num_target_matches}
                    </ZUIText>
                  </Box>
                  <ZUIText variant="headingSm">targets</ZUIText>
                </Box>
              </Box>
            )}
            {!isMobile && (
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Box>
                  <Box
                    mr={1}
                    sx={(theme) => ({ color: theme.palette.data.main })}
                  >
                    <ZUIText color="inherit">{stats.num_calls_reached}</ZUIText>
                  </Box>
                  <ZUIText variant="headingSm">successful calls </ZUIText>
                </Box>
                <Box>
                  <Box
                    mr={1}
                    sx={(theme) => ({ color: theme.palette.data.main })}
                  >
                    <ZUIText color="inherit">{stats.num_calls_made}</ZUIText>
                  </Box>
                  <Box sx={{ color: theme.palette.data.main }}>
                    <ZUIText variant="headingSm"> calls made</ZUIText>
                  </Box>
                </Box>
                <Box>
                  <Box
                    mr={1}
                    sx={(theme) => ({ color: theme.palette.data.main })}
                  >
                    <ZUIText color="inherit">
                      {stats.num_target_matches}
                    </ZUIText>
                  </Box>
                  <ZUIText variant="headingSm">people in target group</ZUIText>
                </Box>
              </Box>
            )}
          </>
        )}
        title={'Assignment'}
      />
      {assignment.instructions && (
        <Box mt={2}>
          <ZUISection
            renderContent={() => (
              <ZUIText>
                <ZUIMarkdown markdown={assignment.instructions} />
              </ZUIText>
            )}
            title={'Instructions'}
          />
        </Box>
      )}
    </Box>
  );
};

export default AssignmentStatsPage;
