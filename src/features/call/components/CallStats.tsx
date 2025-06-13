'use client';

import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import { FC, useState } from 'react';

import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import useSimpleCallAssignmentStats from '../hooks/useSimpleCallAssignmentStats';
import InstructionsSection from './InstructionsSection';
import useAllocateCall from '../hooks/useAllocateCall';
import ZUIAlert from 'zui/components/ZUIAlert';
import useIsMobile from 'utils/hooks/useIsMobile';
import PreviousCallsSection from './PreviousCallsSection';
import { ZetkinCallAssignment, ZetkinEvent } from 'utils/types/zetkin';
import PreviousCallsSearch from './PreviousCallsSearch';

export type EventsByProject = {
  campaign: { id: number; title: string };
  events: ZetkinEvent[];
};

type CallStatsProps = {
  assignment: ZetkinCallAssignment;
  onSwitchCall: () => void;
};

const CallStats: FC<CallStatsProps> = ({ assignment, onSwitchCall }) => {
  const stats = useSimpleCallAssignmentStats(
    assignment.organization.id,
    assignment.id
  );
  const { error } = useAllocateCall(assignment.organization.id, assignment.id);
  const isMobile = useIsMobile();
  const router = useRouter();
  const [debouncedInput, setDebouncedInput] = useState<string>('');

  return (
    <>
      {error !== null && (
        <Box p={2}>
          <ZUIAlert
            button={{
              label: 'Choose another assignment',
              onClick: () => {
                router.push(`/my/home`);
              },
            }}
            description="The call queue is empty at the moment. More people might be added shortly, but for now you can't continue calling in this assingment."
            severity={'warning'}
            title={'No more people to call!'}
          />
        </Box>
      )}
      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        width="100%"
      >
        <Box flex={isMobile ? 'none' : '5'} order={isMobile ? 1 : 2} p={2}>
          <Box display="flex" flexDirection="column" gap={2}>
            <ZUISection
              renderContent={() => (
                <>
                  {isMobile && (
                    <Box
                      display="flex"
                      gap={10}
                      justifyContent="flex-start"
                      mt={2}
                    >
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
                          <ZUIText color="inherit">
                            {stats.num_calls_reached}
                          </ZUIText>
                        </Box>
                        <ZUIText variant="headingSm">successful calls </ZUIText>
                      </Box>
                      <Box>
                        <Box
                          mr={1}
                          sx={(theme) => ({ color: theme.palette.data.main })}
                        >
                          <ZUIText color="inherit">
                            {stats.num_calls_made}
                          </ZUIText>
                        </Box>
                        <Box
                          sx={(theme) => ({ color: theme.palette.data.main })}
                        >
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
                        <ZUIText variant="headingSm">
                          people in target group
                        </ZUIText>
                      </Box>
                    </Box>
                  )}
                </>
              )}
              subtitle="These are people you have interacted with during this assignment."
              title={'Assignment'}
            />
            <Box mt={2}>
              <InstructionsSection instructions={assignment.instructions} />
            </Box>
          </Box>
        </Box>
        <Box flex={isMobile ? 'none' : '5'} order={isMobile ? 1 : 2} p={2}>
          <ZUISection
            renderContent={() => (
              <Box
                display="flex"
                flexDirection="column"
                sx={{
                  overflowX: 'hidden',
                  width: '100%',
                }}
              >
                <Box my={1}>
                  <PreviousCallsSearch
                    onDebouncedChange={(value) => {
                      setDebouncedInput(value);
                    }}
                  />
                </Box>
                <PreviousCallsSection
                  assingmentId={assignment.id}
                  onSwitchCall={onSwitchCall}
                  orgId={assignment.organization.id}
                  searchTerm={debouncedInput}
                />
              </Box>
            )}
            title="Your calls"
          />
        </Box>
      </Box>
    </>
  );
};

export default CallStats;
