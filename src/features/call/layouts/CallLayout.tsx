'use client';

import { Box, Button } from '@mui/material';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { FC, ReactNode } from 'react';

import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import SkipCallDialog from '../components/SkipCallDialog';
import { useAppSelector } from 'core/hooks';
import useMyCallAssignments from 'features/callAssignments/hooks/useMyCallAssignments';

type Props = {
  children?: ReactNode;
};

const CallLayout: FC<Props> = ({ children }) => {
  const pathname = usePathname() || '';
  const isPreparePage = pathname.endsWith('/prepare');
  const call = useAppSelector((state) => state.call.currentCall).data;

  const assignments = useMyCallAssignments();
  const params = useParams();
  const callAssIdParam = params?.callAssId;
  const callAssId = Array.isArray(callAssIdParam)
    ? callAssIdParam[0]
    : callAssIdParam;

  let assignment;

  if (callAssId) {
    assignment = assignments.find(
      (assignment) => assignment.id === parseInt(callAssId, 10)
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: 2,
        }}
      >
        <Link href="/my/home" passHref>
          <Button variant="outlined">
            <Msg id={messageIds.nav.backToHome} />
          </Button>
        </Link>
        <Box>
          {isPreparePage && call && assignment && (
            <SkipCallDialog
              assignment={assignment}
              callId={call?.id}
              targetName={
                call?.target.first_name + ' ' + call?.target.last_name
              }
            />
          )}

          <Button variant="contained">
            <Msg id={messageIds.nav.startCalling} />
          </Button>
        </Box>
      </Box>
      <Box>{children}</Box>
    </Box>
  );
};

export default CallLayout;
