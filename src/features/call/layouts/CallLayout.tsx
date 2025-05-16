'use client';

import { usePathname } from 'next/navigation';
import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';

import useMyCallAssignments from 'features/callAssignments/hooks/useMyCallAssignments';
import ZUIDivider from 'zui/components/ZUIDivider';
import PrepareHeader from '../components/PrepareHeader';
import StatsHeader from '../components/StatsHeader';

type Props = {
  callAssId: string;
  children?: ReactNode;
};

const CallLayout: FC<Props> = ({ callAssId, children }) => {
  const assignments = useMyCallAssignments();
  const assignment = assignments.find(
    (assignment) => assignment.id === parseInt(callAssId)
  );

  const getDetailsPage = (pathname: string) => {
    if (!pathname) {
      return false;
    }
    const segments = pathname.split('/');
    if (segments.length === 3 && segments[1] === 'call') {
      const callId = Number(segments[2]);
      return !isNaN(callId);
    }
    return false;
  };

  const pathname = usePathname() || '';
  const isPreparePage = pathname.endsWith('/prepare');
  const isOngoingPage = pathname.endsWith('/ongoing');
  const isStatsPage = getDetailsPage(pathname);

  return (
    <Box>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.common.white,
        })}
      >
        {isStatsPage && assignment && <StatsHeader assignment={assignment} />}
        {(isPreparePage || isOngoingPage) && assignment && (
          <PrepareHeader assignment={assignment} />
        )}
      </Box>
      <ZUIDivider />
      <Box>{children}</Box>
    </Box>
  );
};

export default CallLayout;
