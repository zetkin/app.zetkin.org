import { Box } from '@mui/material';
import { FC } from 'react';

import { ZetkinCallAssignmentStats } from 'features/callAssignments/apiTypes';
import useIsMobile from 'utils/hooks/useIsMobile';
import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type Props = {
  stats: ZetkinCallAssignmentStats;
};

export const DesktopStats: FC<Props> = ({ stats }) => {
  return (
    <Box
      display="flex"
      gap={2}
      justifyContent="space-between"
      mt={2}
      width="100%"
    >
      <Box sx={{ width: 1 / 3 }}>
        <Box mr={1} sx={(theme) => ({ color: theme.palette.data.main })}>
          <ZUIText color="inherit">{stats.num_calls_reached}</ZUIText>
        </Box>
        <ZUIText variant="headingSm">
          <Msg id={messageIds.stats.successfulCalls} />
        </ZUIText>
      </Box>
      <Box sx={{ width: 1 / 3 }}>
        <Box mr={1} sx={(theme) => ({ color: theme.palette.data.main })}>
          <ZUIText color="inherit">{stats.num_calls_made}</ZUIText>
        </Box>
        <Box sx={(theme) => ({ color: theme.palette.data.main })}>
          <ZUIText variant="headingSm">
            <Msg id={messageIds.stats.callsMade} />
          </ZUIText>
        </Box>
      </Box>
      <Box sx={{ width: 1 / 3 }}>
        <Box mr={1} sx={(theme) => ({ color: theme.palette.data.main })}>
          <ZUIText color="inherit">{stats.num_target_matches}</ZUIText>
        </Box>
        <ZUIText variant="headingSm">
          <Msg id={messageIds.stats.inTargetGroup} />
        </ZUIText>
      </Box>
    </Box>
  );
};

const AssignmentStats: FC<Props> = ({ stats }) => {
  const messages = useMessages(messageIds);
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
                <ZUIText variant="headingSm">
                  <Msg id={messageIds.stats.successful} />
                </ZUIText>
              </Box>
              <Box>
                <Box
                  mr={1}
                  sx={(theme) => ({ color: theme.palette.data.main })}
                >
                  <ZUIText color="inherit">{stats.num_target_matches}</ZUIText>
                </Box>
                <ZUIText variant="headingSm">
                  <Msg id={messageIds.stats.targets} />
                </ZUIText>
              </Box>
            </Box>
          )}
          {!isMobile && <DesktopStats stats={stats} />}
        </>
      )}
      subtitle={messages.stats.description()}
      title={messages.stats.title()}
    />
  );
};

export default AssignmentStats;
