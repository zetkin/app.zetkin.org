'use client';

import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import { FC, useState } from 'react';

import ZUISection from 'zui/components/ZUISection';
import useSimpleCallAssignmentStats from '../hooks/useSimpleCallAssignmentStats';
import InstructionsSection from './InstructionsSection';
import useAllocateCall from '../hooks/useAllocateCall';
import ZUIAlert from 'zui/components/ZUIAlert';
import useIsMobile from 'utils/hooks/useIsMobile';
import PreviousCallsSection from './PreviousCallsSection';
import { ZetkinCallAssignment, ZetkinEvent } from 'utils/types/zetkin';
import PreviousCallsSearch from './PreviousCallsSearch';
import AssignmentStats from './AssignmentStats';

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
      {error && (
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
        gap={2}
        padding={2}
        width="100%"
      >
        <Box
          display="flex"
          flex={isMobile ? 'none' : '5'}
          flexDirection="column"
          gap={2}
          order={isMobile ? 1 : 2}
        >
          <AssignmentStats stats={stats} />
          <InstructionsSection instructions={assignment.instructions} />
        </Box>
        <Box flex={isMobile ? 'none' : '5'} order={isMobile ? 1 : 2}>
          <ZUISection
            renderContent={() => (
              <Box
                display="flex"
                flexDirection="column"
                gap={1}
                sx={{
                  overflowX: 'hidden',
                  paddingTop: 1,
                  width: '100%',
                }}
              >
                <PreviousCallsSearch
                  onDebouncedChange={(value) => {
                    setDebouncedInput(value);
                  }}
                />
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
