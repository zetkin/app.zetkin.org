'use client';

import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import { FC } from 'react';

import { ZetkinCallAssignment, ZetkinEvent } from 'utils/types/zetkin';
import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import useSimpleCallAssignmentStats from '../hooks/useSimpleCallAssignmentStats';
import InstructionsSection from '../components/InstructionsSection';
import useAllocateCall from '../hooks/useAllocateCall';
import ZUIAlert from 'zui/components/ZUIAlert';
import useIsMobile from 'utils/hooks/useIsMobile';

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
  const { error } = useAllocateCall(assignment.organization.id, assignment.id);
  const isMobile = useIsMobile();
  const router = useRouter();

  return (
    <Box display="flex" flexDirection="column" gap={2} m={2}>
      {error !== null && (
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
      )}
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
                  <Box sx={(theme) => ({ color: theme.palette.data.main })}>
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

      <Box mt={2}>
        <InstructionsSection instructions={assignment.instructions} />
      </Box>
    </Box>
  );
};

export default AssignmentStatsPage;
