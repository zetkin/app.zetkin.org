import { Box } from '@mui/material';
import { FC } from 'react';

import { ZetkinCallAssignmentStats } from 'features/callAssignments/apiTypes';
import useIsMobile from 'utils/hooks/useIsMobile';
import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';

type Props = {
  stats: ZetkinCallAssignmentStats;
};

const AssignmentStats: FC<Props> = ({ stats }) => {
  const isMobile = useIsMobile();
  return (
    <ZUISection
      borders={false}
      fullHeight
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
                    <ZUIText color="inherit">{stats.num_calls_reached}</ZUIText>
                  </Box>
                  <ZUIText color="secondary">/ {stats.num_calls_made}</ZUIText>
                </Box>
                <ZUIText variant="headingSm">successful</ZUIText>
              </Box>
              <Box>
                <Box
                  mr={1}
                  sx={(theme) => ({ color: theme.palette.data.main })}
                >
                  <ZUIText color="inherit">{stats.num_target_matches}</ZUIText>
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
                <Box sx={(theme) => ({ color: theme.palette.data.main })}>
                  <ZUIText variant="headingSm"> calls made</ZUIText>
                </Box>
              </Box>
              <Box>
                <Box
                  mr={1}
                  sx={(theme) => ({ color: theme.palette.data.main })}
                >
                  <ZUIText color="inherit">{stats.num_target_matches}</ZUIText>
                </Box>
                <ZUIText variant="headingSm">people in target group</ZUIText>
              </Box>
            </Box>
          )}
        </>
      )}
      subtitle="This is how the assignment is going."
      title="Assignment stats"
    />
  );
};

export default AssignmentStats;
